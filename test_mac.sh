curl -X PUT -d '{"in_port":"00000001","out_port":"00000003","mac_src":"00:00:00:00:00:01","mac_dst":"00:00:00:00:00:02"}' http://127.0.0.1:8080/flow/0000000000000001
curl -X PUT -d '{"in_port":"00000003","out_port":"00000001","mac_src":"00:00:00:00:00:02","mac_dst":"00:00:00:00:00:01"}' http://127.0.0.1:8080/flow/0000000000000001
curl -X PUT -d '{"in_port":"00000001","out_port":"00000002","mac_src":"00:00:00:00:00:01","mac_dst":"00:00:00:00:00:02"}' http://127.0.0.1:8080/flow/0000000000000002
curl -X PUT -d '{"in_port":"00000002","out_port":"00000001","mac_src":"00:00:00:00:00:02","mac_dst":"00:00:00:00:00:01"}' http://127.0.0.1:8080/flow/0000000000000002
curl -X PUT -d '{"in_port":"00000001","out_port":"00000003","mac_src":"00:00:00:00:00:01","mac_dst":"00:00:00:00:00:02"}' http://127.0.0.1:8080/flow/0000000000000004
curl -X PUT -d '{"in_port":"00000003","out_port":"00000001","mac_src":"00:00:00:00:00:02","mac_dst":"00:00:00:00:00:01"}' http://127.0.0.1:8080/flow/0000000000000004

