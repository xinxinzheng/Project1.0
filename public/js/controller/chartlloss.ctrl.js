/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-03-24 22:31:49
 * @version $Id$
 */
"use strict";
app.controller('chartllossCtrl', function($rootScope, $scope) {
	$scope.showCount = 20 ;
    $scope.produceCharts = function() {
        var charts = [] , data = [] , name = '' , length = $scope.allLinkInfo.length;
        if(length < $scope.showCount){
        	var temp = $scope.allLinkInfo[0] ;
        	for(var i = 0 ; i < ($scope.showCount - length) ; i++){
        		_temp = [];
        		temp.map(function(_item,_i){
        			let time = _item.time - $scope.timeIntval * i ; 
        			_temp.push({
        				link_id:_item.link_id,
        				link_rate:_item.link_rate,
        				link_loss:_item.link_loss,
        				time:time
        			});
        		})       	
        		$scope.allLinkInfo.unshift(_temp);
        	}
        }
        $scope.allLinkInfo.slice(-$scope.showCount).map(function(_item, _i) {
           _item.map(function(row,_j){
           		name = row.link_id ;
           		data[name] = data[name] ? data[name] : [];
           		data[name].push({ x: row.time , y: parseInt(row.link_loss) });	          		
           })
        });
        for(var key in data){
        	charts.push({name:key,data:data[key]});
        }
        return charts;
    };

    $scope.initChartslink = function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        $('#charts-loss').highcharts({
            chart: {
                type: 'spline',
                animation: true,
                events: {
                    load: function() {
                    	var self = this;
                    	$scope.$watch('allLinkInfo',function(newValue,oldValue){
                    		var series = self.series;
                    		var newData = newValue[newValue.length-1];
                    		series.map(function(_item, _i) {         			
                    			newData.map(function(row,_j){      
                    				row.link_id == _item.name ? _item.addPoint([row.time, parseInt(row.link_loss)], true, true) : '';
                    			});	                            
                        	})
                    	},true)                       
                    }
                },
                style: { 'border-radius': '0 0 5px 5px', 'width': '100%', 'height': 400 }

            },
            title: {
                text: '链路实时丢包率--' + $scope.timeIntval/1000  + '秒'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 100
            },
            yAxis: {
                title: {
                    text: '丢包率'
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
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>丢包率：' +
                        Highcharts.numberFormat(this.y, 2) + '%';
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
