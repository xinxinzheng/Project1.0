"use strict";
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