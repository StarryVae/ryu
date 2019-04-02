import logging
import os
import json
import ast
import time
from webob import Response

from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller import dpset
from ryu.controller.handler import MAIN_DISPATCHER, DEAD_DISPATCHER
from ryu.controller.handler import set_ev_cls
from ryu.ofproto import ofproto_v1_3
from ryu.lib import hub
from ryu.lib.packet import packet
from ryu.app.wsgi import ControllerBase, WSGIApplication, route
from ryu.lib import dpid as dpid_lib
from ryu.lib import port_no as port_no_lib
from ryu.lib import ofctl_utils

from webob.static import DirectoryApp

import search

flow_monitor_instance_name = 'flow_monitor_api_app'
PATH = os.path.dirname(__file__)
UTIL = ofctl_utils.OFCtlUtil(ofproto_v1_3)


class flow_monitor(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    _CONTEXTS = {'wsgi': WSGIApplication}

    def __init__(self, *args, **kwargs):
        super(flow_monitor, self).__init__(*args, **kwargs)

        self.flow_stats = {}
        self.datapaths = {}
        self.qos = {}
        self.cmd = {}
        wsgi = kwargs['wsgi']
        wsgi.register(FlowController,
                      {flow_monitor_instance_name: self})

    def add_flow(self, dp, p, match, actions, idle_timeout=0, hard_timeout=0):
        ofproto = dp.ofproto
        parser = dp.ofproto_parser
        inst = [parser.OFPInstructionActions(
            ofproto.OFPIT_APPLY_ACTIONS, actions)]
        mod = parser.OFPFlowMod(datapath=dp, priority=p, idle_timeout=idle_timeout,
                                hard_timeout=hard_timeout, match=match, instructions=inst)
        dp.send_msg(mod)

    def send_flow_mod(self, datapath, src_mac, dst_mac, src_port, dst_port):
        parser = datapath.ofproto_parser
        actions = [parser.OFPActionSetQueue(1),parser.OFPActionOutput(dst_port)] 
        #actions.append(parser.OFPActionSetQueue(1))
        #actions.append(parser.OFPActionOutput(dst_port))
        match = parser.OFPMatch(
            in_port=src_port, eth_src=src_mac, eth_dst=dst_mac)
        self.add_flow(datapath, 1, match, actions,
                      idle_timeout=15, hard_timeout=60)

    def send_flow_mod_openstack(self, datapath, src_mac, dst_mac, queue_id):
        ofp = datapath.ofproto
        parser = datapath.ofproto_parser
        actions = [parser.OFPActionSetQueue(queue_id),parser.OFPActionOutput(ofp.OFPP_NORMAL)]
        #actions.append(parser.OFPActionSetQueue(1))
        #actions.append(parser.OFPActionOutput(dst_port))
        match = parser.OFPMatch(
            eth_src=src_mac, eth_dst=dst_mac)
        self.add_flow(datapath, 11, match, actions,
                      idle_timeout=30, hard_timeout=60)

#    def send_flow_mod(self, datapath, ipv4_src, ipv4_dst, src_port, dst_port, queue_id=1):
#        parser = datapath.ofproto_parser
#        actions = [parser.OFPActionSetQueue(queue_id), parser.OFPActionOutput(dst_port)]
#        match = parser.OFPMatch(
#            in_port=src_port, eth_type=2048, ipv4_src=ipv4_src, ipv4_dst=ipv4_dst)
#        self.add_flow(datapath, 1, match, actions,
#                      idle_timeout=15, hard_timeout=60)    


    def _request_flow_stats(self, datapath):
        parser = datapath.ofproto_parser
        req = parser.OFPFlowStatsRequest(datapath)
        datapath.send_msg(req)

    @set_ev_cls(ofp_event.EventOFPStateChange, [MAIN_DISPATCHER, DEAD_DISPATCHER])
    def _state_change_handler(self, ev):
        datapath = ev.datapath
        if ev.state == MAIN_DISPATCHER:
            if not datapath.id in self.datapaths:
                self.logger.debug('register datapath: %016x', datapath.id)
                print('register datapath: %016x' % datapath.id)
                self.datapaths[datapath.id] = datapath
        elif ev.state == DEAD_DISPATCHER:
            if datapath.id in self.datapaths:
                self.logger.debug('unregister datapath: %016x', datapath.id)
                del self.datapaths[datapath.id]

    @set_ev_cls(ofp_event.EventOFPFlowStatsReply, MAIN_DISPATCHER)
    def _flow_stats_reply_handler(self, ev):
        body = ev.msg.body
        dpid = ev.msg.datapath.id
        self.flow_stats.setdefault(dpid, [])
        for stat in sorted([flow for flow in body if flow.priority == 11],
                           key=lambda flow: (flow.match.get('in_port'),
                                             flow.match.get('eth_dst'))):
            value = (stat.match['in_port'], stat.match.get('eth_dst'),
                     stat.instructions[0].actions[1].port)
            
            i = 0

            while i < len(self.flow_stats[dpid]):
                if value==self.flow_stats[dpid][i]:
                    break
                i=i+1

            if i==len(self.flow_stats[dpid]):
                self.flow_stats[dpid].append(value)


class FlowController(ControllerBase):
    def __init__(self, req, link, data, **config):
        super(FlowController, self).__init__(req, link, data, **config)
        path = "%s/html/" % PATH
        self.static_app = DirectoryApp(path)
        self.flow_monitor_app = data[flow_monitor_instance_name]


    @route('flowmonitor', '/{filename:.*}')
    def static_handler(self, req, **kwargs):
        if kwargs['filename']:
            req.path_info = kwargs['filename']
        return self.static_app(req)

    url = '/flow/{dpid}'

    @route('flowmonitor', url, methods=['GET'], requirements={'dpid': dpid_lib.DPID_PATTERN})
    def list_flow(self, req, **kwargs):
        flow_monitor = self.flow_monitor_app
        dpid = dpid_lib.str_to_dpid(kwargs['dpid'])
        if dpid not in flow_monitor.datapaths:
            return Response(status=404)

        flow_monitor._request_flow_stats(flow_monitor.datapaths[dpid])
        time.sleep(0.5)
        flow_table = flow_monitor.flow_stats[dpid]

        body = json.dumps(flow_table)
        return Response(content_type='application/json', body=body)


    @route('flowmonitor', url, methods=['PUT'], requirements={'dpid': dpid_lib.DPID_PATTERN})
    def add_flow(self, req, **kwargs):
        flow_monitor = self.flow_monitor_app
        try:
            new_entry = req.json if req.body else {}
            
        except ValueError:
            return Response(status=400)

        dpid = dpid_lib.str_to_dpid(kwargs['dpid'])
        if dpid not in flow_monitor.datapaths:
            return Response(status=404)

        dp= flow_monitor.datapaths[dpid]        
#        out_port= UTIL.ofp_port_from_user(body.get('out_port', dp.ofproto.OFPP_ANY))
#        in_port= UTIL.ofp_port_from_user(body.get('in_port', dp.ofproto.OFPP_ANY))
        src_mac = new_entry['mac_src']
        dst_mac = new_entry['mac_dst']
    #    ipv4_src = body.get('ipv4_src',0)
    #    ipv4_dst = body.get('ipv4_dst',0)
        in_port = port_no_lib.str_to_port_no(new_entry['in_port'])
        out_port = port_no_lib.str_to_port_no(new_entry['out_port'])
#        ipv4_src = new_entry['ipv4_src']
#        ipv4_dst = new_entry['ipv4_dst']
 #       queue_id = int(new_entry['queue_id'])

        flow_monitor.send_flow_mod(dp, src_mac, dst_mac, in_port, out_port)
#        flow_monitor.send_flow_mod(dp, ipv4_src, ipv4_dst, in_port, out_port, queue_id)
        value={"status":0}
        body=json.dumps(value)
        return Response(content_type='application/json', body=body)

    url2 = '/openstack'
    @route('flowmonitor', url2, methods=['PUT'])
    def add_flow_openstack(self, req, **kwargs):
        flow_monitor = self.flow_monitor_app
        try:
            new_entry = req.json if req.body else {}

        except ValueError:
            return Response(status=400)
        src_instance = new_entry['src']
        dst_instance = new_entry['dst']
        bandwidth = new_entry['bw']
        src_mac = search.parse(src_instance)
        dst_mac = search.parse(dst_instance)
        dpid = flow_monitor.datapaths.keys()[0]
        dp= flow_monitor.datapaths[dpid]
        ovs_port = search.parser_port(dst_instance)
        if flow_monitor.qos.has_key(ovs_port):
            flow_monitor.qos[ovs_port] = flow_monitor.qos[ovs_port] + 1
        else:
            flow_monitor.qos.setdefault(ovs_port,0)
       
        if flow_monitor.cmd.has_key(ovs_port):
            string = 'queues=' + str(flow_monitor.qos[ovs_port]) + '=@q' + str(flow_monitor.qos[ovs_port]) + ','
            flow_monitor.cmd[ovs_port] = flow_monitor.cmd[ovs_port].replace('queues=', string)
            flow_monitor.cmd[ovs_port] = flow_monitor.cmd[ovs_port] + " -- --id=@q" + str(flow_monitor.qos[ovs_port]) + " create queue other-config:min-rate=5000000 other-config:max-rate=" + bandwidth + "000000"
        else:
            cmd = "ovs-vsctl -- set port " + ovs_port + "  qos=@newqos -- --id=@newqos create qos type=linux-htb other-config:max-rate=1000000000 queues=0=@q0 -- --id=@q0 create queue other-config:min-rate=5000000 other-config:max-rate=" + bandwidth + "000000"
            flow_monitor.cmd.setdefault(ovs_port,cmd)

        os.system(flow_monitor.cmd[ovs_port])
 
        flow_monitor.send_flow_mod_openstack(dp, src_mac, dst_mac, flow_monitor.qos[ovs_port])
        value={"status":0}
        body=json.dumps(value)
        return Response(content_type='application/json', body=body)


    url1 = '/login'
    @route('flowmonitor', url1, methods=['PUT'])
    def check(self, req, **kwargs):
        try:
            new_entry = req.json if req.body else {}

        except ValueError:
            return Response(status=400)
 
        user= new_entry['user']
        passwd= new_entry['passwd']

        if (user=='admin') & (passwd == 'wangkai'):
            body=json.dumps({"status":0})
        else:
            body=json.dumps({"status":1}) 

        return Response(content_type='application/json', body=body)

   
