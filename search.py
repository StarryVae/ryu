#coding: utf-8
import xml.dom.minidom

def position(instance_id):
    return '/var/lib/nova/instances/' + instance_id + '/libvirt.xml'

def parse(instance_id):
    file = position(instance_id)
    tree = xml.dom.minidom.parse(file)
    domain = tree.documentElement
    mac = domain.getElementsByTagName('mac')
    address = mac[0]
    return address.getAttribute("address")

def parser_port(instance_id):
    file = position(instance_id)
    tree = xml.dom.minidom.parse(file)
    domain = tree.documentElement
    source = domain.getElementsByTagName('source')
    port = source[1]
    bridge_port = port.getAttribute("bridge")
    ovs_port = bridge_port.replace('qbr','qvo')
    return ovs_port
    
