// Source: public/js/config/config.js
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-03-23 13:55:52
 * @version $Id$
 */
var app = angular.module('myApp', ['ui.router']);

 app.controller("CommonCtrl",function($rootScope , $scope){

 })
 .controller('monitorCtrl',function($rootScope,$scope,$state){
 	$scope.$state = $state;
 })
 .controller('sidebarCtrl',function($rootScope,$scope,$state){
 	$scope.$state = $state;
 })
 .controller('chartsCtrl',function($rootScope,$scope){
 	$scope.hasLink = true;
 })
.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/monitor/data/conf");
    $stateProvider
    .state('monitor', {
            url: '/monitor',
            template: '<div ui-view></div>',
    })
    .state('monitor.data',{
    	url: '/data',
        template: '<div ui-view></div>',
    })
    .state("monitor.data.conf",{
        url:"/conf",
        templateUrl:"/startMonitor.html",
    })
    .state('monitor.data.overview',{
    	url: '/overview',
        templateUrl: 'monitor.html',
    })
    .state('monitor.data.overview.charts', {
            url: '/charts',
            templateUrl: 'datacharts.html',
    })
    .state('monitor.data.overview.list', {
            url: '/list/:link/:monitorParams',
            templateUrl: 'datalist.html',
    })        
 
})





// Source: public/js/controller/charts.link.ctrl.js
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-03-24 22:31:49
 * @version $Id$
 */
app.controller('chartlinkCtrl', function($rootScope, $scope, $interÓval) {
    $scope.conf = {};
    $scope.getData = function() {
        $http({
            url: 'nodes.json',
            type: 'GET'
        });
    };
    
    $scope.getLinkSpeed = function() {
        $scope.getData().success(function(pre) {
            var pre = pre.nodes;
            $setTimeout(function() {
                $scope.getData().success(function(next) {
                    var next = next.nodes;
                })
            }, 1);
        })

    };
    $scope.produceCharts = function() {
        var charts = [];
        $scope.conf.link.map(function(_item, _i) {
            var data = [],
                time = (new Date()).getTime();
            for (var i = -19; i < 0; i++) {
                data.push({ x: time + i * 5000, y: 0 })
            }
            var chart = {
                name: _item.src + ' ' + _item.desc,
                data: data
            };
            charts.push(chart);
        });
        return charts;
    };
    $scope.initChartslink = function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        $('#charts-link').highcharts({
            chart: {
                type: 'spline',
                animation: true,
                events: {
                    load: function() {
                        var series = this.series;
                        series.map(function(_item, _i) {
                            $interval(function() {
                                var x = (new Date()).getTime(),
                                    y = Math.random();
                                _item.addPoint([x, y], true, true);
                            }, 5000);
                        })
                    }
                },
                style: { 'border-radius': '0 0 5px 5px', 'width': '100%', 'height': 400 }

            },
            title: {
                text: '链路实时速率--5秒'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 100
            },
            yAxis: {
                title: {
                    text: '速率'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                    return '<b> 链路：' + this.series.name + '</b><br/>时间：' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>速率：' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: true
            },
            exporting: {
                enabled: true
            },
            series: $scope.produceCharts()
        });
    }
    $scope.initChartslink();
});

// Source: public/js/controller/datalist.ctrl.js
app.controller('datalistCtrl', function($rootScope,$scope){
	
})


// Source: public/js/controller/monitor.ctrl.js
app.controller('monitorCtrl', function($rootScope,$scope,$http,$stateParams){
	$scope.monitorLink = JSON.parse($stateParams.link);
	$scope.monitorParams = JSON.parse($stateParams.monitorParams);
	$scope.timeconf = 1000;//计算速率的时差
	$scope.timeIntval = 5000;//每隔多长时间计算一次
	$scope.linkInfo = [];	
	$scope.allLinkInfo = [];

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
			$scope.nodes = data.nodes.node;
			var preLinkInfo = $scope.findLinkInfo();
			setTimeout(function(){
				$scope.getAllNode().success(function(res){
					$scope.nodes = res.nodes.node;
					var curLinkInfo = $scope.findLinkInfo();
					$scope.linkInfo = [];
					curLinkInfo.map(function(_item,_i){
						preLinkInfo.map(function(row,_j){
							if(_item.src == row.src && _item.dest == row.dest){
								$scope.linkInfo.push({
									link_id : _item.src + ' ' +  _item.dest,
									link_rate:$scope.linkRate(_item,row),
									link_loss:$scope.lossPacketsRate(_item,row),
									time:Date.parse(new Date())
								});
							}
						})
					})
					$scope.allLinkInfo.push($scope.linkInfo);
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
			let src = $scope.findNodeInfo(_item.source.tp);
			let dest = $scope.findNodeInfo(_item.des.tp);
			linkInfo.push({
				src:_item.source.tp,
				dest:_item.des.tp,
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
		let destPre = linkPre.dest_bytes.transmitted + linkPre.src_bytes.received;
		let srcCur = linkCur.src_bytes.transmitted + linkPre.src_bytes.received;
		let destCur = linkCur.dest_bytes.transmitted + linkPre.src_bytes.received;
		let destRate = (destCur - destPre) / $scope.timeconf;
		let srcRate = (srcCur - srcPre) / $scope.timeconf;

		let rate = (destRate + srcRate) / 2 / 1024;
		return rate; 
	}
	/****计算丢包率***/
	$scope.lossPacketsRate = function(linkPre,linkCur){
		let srcPre = linkPre.src_packets.transmitted;
		let destPre = linkPre.dest_packets.received;
		let srcCur = linkPre.src_packets.transmitted;
		let destCur = linkPre.dest_packets.received;
		let loss = (((srcCur - srcPre) - (destCur - destPre)) / (srcCur - srcPre)) * 100;
		return loss;
	}
	/****计算时延***/
	$scope.linkTimeOut = function(){

	}

	/****开始监控***/
	$scope.workFlow();

})


// Source: public/js/controller/startMonitor.ctrl.js
app.controller("startMonitorCtrl", function ($scope, $http, $state) {
    $scope.topologyData = null;//链路数据信息
    $scope.allLinkArr = [];//所有链路
    $scope.chooseLinkArr = [];//选中的链路
    $scope.moreParas = false;//是否展开更多参数
    $scope.tips = "请选择监控参数";
    $scope.linktips = "请选择监控链路";
    $scope.monitorParas = {speed: false, loss: false, delay: false};

    // 拓扑数据请求接口
    $scope.getSourceNode = function () {
        $http({
            method: "GET",
            url: "../../data/topology.json"
        }).success(function (res) {
            if (!res["network-topology"].topology[0].link) {
                $scope.linktips = "没有链路信息，请确保数据正常";
                return;
            }
            $scope.topologyData = $scope.filterData(res["network-topology"].topology[0].link);
        })
    };

    // //提取有效数据
    $scope.filterData = function (data) {
        var des, source, des_tp, source_tp, des_node, source_node;
        var reg = /^openflow:/;
        var nodeArr = {};
        data.map(function (item) {
            des = item.destination || {};
            source = item.source || {};
            des_node = des["dest-node"] || "";
            source_node = source["source-node"] || "";
            if (reg.test(des_node) && reg.test(source_node)) {
                des_tp = des["dest-tp"] || "";
                source_tp = source["source-tp"] || "";
                if (!nodeArr[source_node]) {
                    nodeArr[source_node] = {};
                    nodeArr[source_node].from = {"node": source_node, "tp": source_tp};
                    nodeArr[source_node].end = [];
                    nodeArr[source_node].end.push({"node": des_node, "tp": des_tp});
                } else {
                    if ($.inArray({"node": des_node, "tp": des_tp}, nodeArr[source_node].end) == -1) {
                        nodeArr[source_node].end.push({"node": des_node, "tp": des_tp});
                    }
                }
                $scope.allLinkArr.push({
                    "source": {"node": source_node, "tp": source_tp},
                    "des": {"node": des_node, "tp": des_tp}
                });
            }
        });
        return nodeArr;
    };

    $scope.$watch("linkType", function () {
        $scope.chooseLinkArr = [];
        $scope.sourceData = "";
        $scope.desValue = "";
    });

    // //选择链路按钮处理事件
    $scope.confirmLink = function () {
        if ($scope.linkType == "all") {
            $scope.chooseLinkArr = angular.copy($scope.allLinkArr);
            return;
        }
        var item = {
            "source": $scope.sourceData.from,
            "des": $scope.desValue
        };
        if ($.inArray(item, $scope.chooseLinkArr) >= 0) {
            return;
        }
        $scope.chooseLinkArr.push(item);
    };

    // //删除某条链路事件
    $scope.delCurrItem = function (item) {
        var i = $.inArray(item, $scope.chooseLinkArr);
        i >= 0 ? $scope.chooseLinkArr.splice(i, 1) : "";
    };

    $scope.startMonitor = function () {
        $state.go('monitor.data.overview.list', {
            link: JSON.stringify($scope.chooseLinkArr),
            monitorParams: JSON.stringify($scope.monitorParas)
        });
    };

    $scope.getSourceNode();
});