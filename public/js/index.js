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


// Source: public/js/controller/startMonitor.ctrl.js
app.controller("startMonitorCtrl", function ($scope, $http,$state) {
    $scope.topologyData = null;//链路数据信息
    $scope.allLinkArr = [];//所有链路
    $scope.chooseLinkArr = [];//选中的链路
    $scope.moreParas = false;//是否展开更多参数
    $scope.tips = "请选择监控参数";
    $scope.linktips = "请选择监控链路";
    $scope.monitorParas = {speed:false,loss:false,delay:false};

    // 拓扑数据请求接口
    $scope.getSourceNode = function(){
        $http({
            method: "GET",
            url: "../../data/topology.json"
        }).success(function(res){
            if (!res["network-topology"].topology[0].link) {
            	$scope.linktips = "没有链路信息，请确保数据正常";
                return;
            }
            $scope.topologyData = $scope.filterData(res["network-topology"].topology[0].link);
        })
    };

    // //提取有效数据
    $scope.filterData = function (data) {
        var des, source;
        var reg = /^openflow:/;
        var nodeArr = {};
        data.map(function (item) {
            des = item.destination["dest-node"] || "";
            source = item.source["source-node"] || "";
            if (reg.test(des) && reg.test(source)) {
                if (!nodeArr[source]) {
                    nodeArr[source] = {};
                    nodeArr[source].first = source;
                    nodeArr[source].second = [];
                    nodeArr[source].second.push(des);
                } else {
                    if ($.inArray(des, nodeArr[source].second) == -1) {
                        nodeArr[source].second.push(des);
                    }
                }
                $scope.allLinkArr.push(source + " " + des);
            }
        });
        return nodeArr;
    };

    $scope.$watch("linkType", function () {
        $scope.chooseLinkArr = [];
    });

    // //选择链路按钮处理事件
    $scope.confirmLink = function () {
        if ($scope.linkType == "all") {
            $scope.chooseLinkArr = $scope.allLinkArr;
            return;
        }
        var item = $scope.sourceData.first + " " + $scope.desValue;
        if ($.inArray(item, $scope.chooseLinkArr) >= 0) {
            return;
        }
        $scope.chooseLinkArr.push(item);
    };

    // //删除某条链路事件
    $scope.delCurrItem = function (item) {
		var i = $.inArray(item, $scope.chooseLinkArr) ;
		i > 0 ? $scope.chooseLinkArr.splice(i, 1) : '';
    };

    $scope.startMonitor = function(){
    	$state.go('monitor.data.overview.list',{link:JSON.stringify($scope.chooseLinkArr),monitorParams:JSON.stringify($scope.monitorParas)});
    }

    $scope.getSourceNode();
});