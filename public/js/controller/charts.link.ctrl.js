/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-03-24 22:31:49
 * @version $Id$
 */
"use strict";
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
