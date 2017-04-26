"use strict";
app.controller('monitorCtrl', function($rootScope,$scope,$http,$stateParams,$state){
	$scope.monitorLink = JSON.parse($stateParams.link);
	$scope.monitorParams = JSON.parse($stateParams.monitorParams);
	$scope.timeconf = 1000;//计算速率的时差
	$scope.timeIntval = 5000;//每隔多长时间计算一次
	$scope.linkInfo = [];	
	$scope.allLinkInfo = localStorage.allLinkInfo ? JSON.parse(localStorage.allLinkInfo) : [];
	//获取所有节点数据	
	$scope.getAllNode = function(){
		return $http({
			method:'GET',
			url:'data/nodes.json'
		})
	}
	/***速率 丢包率 计算****/
	$scope.workFlow = function(){
		$scope.getAllNode().success(function(data){
			// $scope.nodes = data.nodes.node;
			$scope.nodes = $.mock().nodes.node;
			var preLinkInfo = $scope.findLinkInfo();
			setTimeout(function(){
				$scope.getAllNode().success(function(res){
					// $scope.nodes = res.nodes.node;
					$scope.nodes = $.mock().nodes.node;
					var curLinkInfo = $scope.findLinkInfo();
					$scope.linkInfo = [];
					var time = Date.parse(new Date());
					curLinkInfo.map(function(_item,_i){
						preLinkInfo.map(function(row,_j){
							if(_item.src == row.src && _item.dest == row.dest){
								$scope.linkInfo.push({
									link_id : _item.src + ' ' +  _item.dest,
									link_rate:$scope.linkRate(_item,row),
									link_loss:$scope.lossPacketsRate(_item,row),
									time:time
								});
							}
						})
					})
					$scope.allLinkInfo.push($scope.linkInfo);
					localStorage.allLinkInfo = JSON.stringify($scope.allLinkInfo);
					setTimeout(function(){$scope.workFlow();},$scope.timeIntval)
			})
			},$scope.timeconf)
			
		})
	}
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
			let src = $scope.findNodeInfo(_item.from.tp);
			let dest = $scope.findNodeInfo(_item.end.tp);
			linkInfo.push({
				src:_item.from.tp,
				dest:_item.end.tp,
				src_bytes:src.bytes,
				src_packets:src.packets,
				dest_bytes:dest.bytes,
				dest_packets:dest.packets
			});
		})
		return linkInfo;
	}
	
	/****计算链路速率***/
	$scope.linkRate = function(linkPre,linkCur){
		let srcPre = linkPre.src_bytes.transmitted + linkPre.src_bytes.received;
		let destPre = linkPre.dest_bytes.transmitted + linkPre.dest_bytes.received;
		let srcCur = linkCur.src_bytes.transmitted + linkPre.src_bytes.received;
		let destCur = linkCur.dest_bytes.transmitted + linkPre.dest_bytes.received;
		let destRate = (destCur - destPre) / $scope.timeconf;
		let srcRate = (srcCur - srcPre) / $scope.timeconf;

		let rate = (destRate + srcRate) / 2 / 1024;
		return rate.toFixed(2); 
	}
	/****计算丢包率***/
	$scope.lossPacketsRate = function(linkPre,linkCur){
		let srcPre = linkPre.src_packets.transmitted;
		let destPre = linkPre.dest_packets.received;
		let srcCur = linkCur.src_packets.transmitted;
		let destCur = linkCur.dest_packets.received;
		let loss = (((srcCur - srcPre) - (destCur - destPre)) / (srcCur - srcPre)) * 100;
		return loss.toFixed(2);
	}
	/****计算时延***/
	$scope.linkTimeOut = function(){

	}

	$scope.showList = function(){
		$state.go('monitor.data.overview.list',{
			link:$stateParams.link,
			monitorParams:$stateParams.monitorParams
		});
	}
	$scope.showCharts = function(){
		$state.go('monitor.data.overview.charts',{
			link:$stateParams.link,
			monitorParams:$stateParams.monitorParams
		});
	}
	/****开始监控***/
	$scope.workFlow();

})

