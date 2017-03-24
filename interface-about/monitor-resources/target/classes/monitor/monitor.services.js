/*
 * Copyright (c) 2015 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

/*define(['app/monitor/monitor.module'],function(monitor) {


  monitor.register.factory('monitor', function($http, ENV) {
    var svc = {
      base: ENV.getBaseURL("MD_SAL") + "/restconf/"
    };

    /*
     * You can define all of your REST API interactions here.
     */

   // return svc;
 // });

//});

define(['app/monitor/monitor.module'],function(s) {

  s.factory('MonitorRestangular', function(Restangular, ENV) {
    return Restangular.withConfig(function(RestangularConfig) {
      RestangularConfig.setBaseUrl(ENV.getBaseURL("MD_SAL"));
    });
  });

 s.factory('MonitorInventorySvc', function(MonitorRestangular) {
    var svc = {
      base: function() {
        return MonitorRestangular.one('restconf').one('operational').one('network-topology:network-topology');
      },
      data : null,
	monitor:{
		src:"1",
		dst:"2",
		monitor:"3"
	},
	TOPOLOGY_CONST: {
              HT_SERVICE_ID:"host-tracker-service:id",
              IP:"ip",
              HT_SERVICE_ATTPOINTS:"host-tracker-service:attachment-points",
              HT_SERVICE_TPID:"host-tracker-service:tp-id",
              NODE_ID:"node-id",
              SOURCE_NODE:"source-node",
              DEST_NODE:"dest-node",
              SOURCE_TP:"source-tp",
              DEST_TP:"dest-tp",
              ADDRESSES:"addresses",
              HT_SERVICE_ADDS:"host-tracker-service:addresses",
              HT_SERVICE_IP:"host-tracker-service:ip"
          }
    };
	


	svc.getSelected = function(){
		return svc.monitor;
	};
	svc.setSelected = function(a){
		svc.monitor=a;
	};


    svc.getCurrentData = function() {
      return svc.data;
    };

    svc.getAllNodes = function() {
      svc.data = svc.base().getList();
      return svc.data;
    };

      return svc;
  });//end factory MonitorInventorySvc



  s.factory('LinkRestangular', function(Restangular, ENV) {
      return Restangular.withConfig(function(RestangularConfig) {
      RestangularConfig.setBaseUrl(ENV.getBaseURL("MD_SAL"));
    });
  });

 s.factory('LinkInventorySvc', function(LinkRestangular) {
    var svc = {
      base: function() {
        return LinkRestangular.one('restconf').one('operational').one('opendaylight-inventory:nodes');
      },
      data : null
    };

    svc.getCurrentData = function() {
      return svc.data;
    };

    svc.getAllNodes = function() {
      svc.data = svc.base().getList();
      return svc.data;
    };

    svc.getNode = function(node) {
      return svc.base().one('node', node).get();
    };

    return svc;
  });


});

