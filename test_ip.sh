curl -X PUT -d '{"in_port":"00000001","out_port":"00000003","ipv4_src":"10.0.0.1","ipv4_dst":"10.0.0.2","queue_id":"1"}' http://127.0.0.1:8080/flow/0000000000000001
curl -X PUT -d '{"in_port":"00000003","out_port":"00000001","ipv4_src":"10.0.0.2","ipv4_dst":"10.0.0.1","queue_id":"1"}' http://127.0.0.1:8080/flow/0000000000000001
curl -X PUT -d '{"in_port":"00000001","out_port":"00000002","ipv4_src":"10.0.0.1","ipv4_dst":"10.0.0.2","queue_id":"1"}' http://127.0.0.1:8080/flow/0000000000000002
curl -X PUT -d '{"in_port":"00000002","out_port":"00000001","ipv4_src":"10.0.0.2","ipv4_dst":"10.0.0.1","queue_id":"1"}' http://127.0.0.1:8080/flow/0000000000000002
curl -X PUT -d '{"in_port":"00000001","out_port":"00000003","ipv4_src":"10.0.0.1","ipv4_dst":"10.0.0.2","queue_id":"1"}' http://127.0.0.1:8080/flow/0000000000000004
curl -X PUT -d '{"in_port":"00000003","out_port":"00000001","ipv4_src":"10.0.0.2","ipv4_dst":"10.0.0.1","queue_id":"1"}' http://127.0.0.1:8080/flow/0000000000000004
