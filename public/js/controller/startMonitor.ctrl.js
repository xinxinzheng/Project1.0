"use strict";
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