"use strict";
app.controller('monitorCtrl', function($rootScope,$scope,$http,$stateParams){
	$scope.monitorLink = JSON.parse($stateParams.link);
	$scope.monitorParams = JSON.parse($stateParams.monitorParams);
	$scope.timeconf = 5000;
	$scope.getAllNode = function(){
		$http({
			method:'GET',
			url:'data/nodes.json'
		}).success(function(data){
			$scope.nodes = data.nodes.node;
			$scope.findLinkInfo();
		})
	}
	$scope.getAllNode();//获取所有节点数据	

	/*****找到单个节点的bytes与packets信息****/
	$scope.findNodeInfo = function(nodeName){
		var node = {name:nodeName};
		$scope.nodes.map(function(_item,_i){
			if(nodeName.indexOf(_item.id) != -1){
				let connect ;
				connect = _item['node-connector'];
				$.map(connect,function(row,_j){
					row.id == nodeName ? node.bytes = row['opendaylight-port-statistics:flow-capable-node-connector-statistics'].bytes : '';
					row.id == nodeName ? node.packets = row['opendaylight-port-statistics:flow-capable-node-connector-statistics'].packets : '';
				})

			} 
		})
		return node;		
	}
	/******找到所有链路的节点信息******/
	$scope.findLinkInfo = function(){
		var linkInfo = [];
		$scope.monitorLink.map(function(_item,_i){
			let link = _item.split(' '); 
			let src = $scope.findNodeInfo(link[0]);
			let dest = $scope.findNodeInfo(link[1]);
			linkInfo.push({src:_item.src,dest:_item.dest,src_bytes:src.bytes,src_packets:src.packets,dest_bytes:dest.bytes,dest_packets:dest.packets});
		})
		return linkInfo;
	}
	$scope.bytes={
             figBytes:function(portid,data1){
               var bytes=0;
                for (var i=0; i<data1.length;  i++){
                var tmp=data1[i];
                var port_arr=tmp['node-connector'];
                for(var j=0; j<port_arr.length;j++){
                  var portId=port_arr[j].id;
                if(portId==portid){
                  var tx_bytes=port_arr[j]['opendaylight-port-statistics:flow-capable-node-connector-statistics']['bytes']['transmitted'];
                  var rx_bytes=port_arr[j]['opendaylight-port-statistics:flow-capable-node-connector-statistics']['bytes']['received'];
                   bytes=tx_bytes+rx_bytes;
                }

                }
              }
              return bytes;
             },//end figBytes  
           };//end bytes
	/****计算链路速率***/
	$scope.linkRate = function(linkPre,linkCur){
		var tx_bytes=port_arr[j]['opendaylight-port-statistics:flow-capable-node-connector-statistics']['bytes']['transmitted'];
        var rx_bytes=port_arr[j]['opendaylight-port-statistics:flow-capable-node-connector-statistics']['bytes']['received'];
        bytes=tx_bytes+rx_bytes;
	}
	/****计算丢包率***/
	$scope.lossPacketsRate = function(){

	}
	/****计算时延***/
	$scope.linkTimeOut = function(){

	}

	/****开始监控****/
	$scope.startMonitor = function(item){
		$scope.selectedPort.monitor = item;
		var lenMyLink = $scope.myLink.length;
		$scope.sendSrc = null;
		$scope.sendDst = null;
		for(var i = 0;i< lenMyLink ; i++)
		{
			if(($scope.myLink[i]['source']['source-node']==$scope.selectedPort.src) &&
				($scope.myLink[i]['destination']['dest-node']==$scope.selectedPort.dst))
			{
				$scope.sendSrc=$scope.myLink[i]['source']['source-tp'];
				$scope.sendDst=$scope.myLink[i]['destination']['dest-tp'];
				i=lenMyLink;
			}
		}

		$state.go('main.monitor.detail', {src:$scope.sendSrc,dst:$scope.sendDst,mnt:$scope.selectedPort.monitor});
		
	};

})

