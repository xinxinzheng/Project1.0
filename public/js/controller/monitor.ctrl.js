"use strict";
app.controller('monitorCtrl', function($rootScope,$scope,$http){
	$scope.conf = {};
	$scope.conf.link = [
		{'src':'openflow:3:1','dest':'openflow:1:2'}
	];
	
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
		var link = [];
		$scope.conf.link.map(function(_item,_i){
			let src = $scope.findNodeInfo(_item.src);
			let dest = $scope.findNodeInfo(_item.dest);
			link.push({src:_item.src,dest:_item.dest,src_bytes:src.bytes,src_packets:src.packets,dest_bytes:dest.bytes,dest_packets:dest.packets});
		})
		return link;
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

