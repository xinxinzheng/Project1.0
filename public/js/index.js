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
    $urlRouterProvider.otherwise("/monitor/data/charts");
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
            url: '/list',
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
app.controller('chartlinkCtrl',function($rootScope,$scope){

$scope.initChartslink = function(){
	Highcharts.setOptions({                                                     
		global: {                                                               
			useUTC: false                                                       
		}                                                                       
	});                                                                 
	$('#charts-link').highcharts({                                                
		chart: {                                                                
			type: 'spline',                                                     
			animation:true,                                                             
			events: {                                                           
				load: function() {                                              																				            
					var series = this.series[0] , serics1 = this.series[0];                                
					setInterval(function() {                                    
						var x = (new Date()).getTime(),         
							y = Math.random();                                  
						series.addPoint([x, y], true, true);   
						// serics1.addPoint([x, y], true, true);                  
					}, 1000);                                                   
				}                                                               
			},
			style:{'border-radius':'0 0 5px 5px','width':'100%','height':400 }
			                                                                 
		},                                                                      
		// title: {                                                                
		// 	text: 'CPU动态走势图--1秒'                                            
		// },                                                                      
		xAxis: {                                                                
			type: 'datetime',                                                   
			tickPixelInterval: 100                                              
		},                                                                      
		yAxis: {                                                                
			// title: {                                                            
			// 	text: 'CPU动态走势图--1秒'                                                   
			// },                                                                  
			plotLines: [{                                                       
				value: 0,                                                       
				width: 1,                                                       
				color: '#808080'                                                
			}]                                                                  
		},                                                                      
		tooltip: {                                                              
			formatter: function() {                                             
					return '<b>'+ this.series.name +'</b><br/>'+                
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
					Highcharts.numberFormat(this.y, 2);                         
			}                                                                   
		},                                                                      
		legend: {                                                               
			enabled: true                                                      
		},                                                                      
		exporting: {                                                            
			enabled: true                                                      
		},                                                                      
		series: [{                                                              
			name: 'Random data',                                                
			data: (function() {                                                 
				// generate an array of random data                             
				var data = [],                                                  
					time = (new Date()).getTime(),                              
					i;                                                          
																				
				for (i = -19; i <= 0; i++) {                                    
					data.push({                                                 
						x: time + i * 1000,                                     
						y: Math.random()                                        
					});                                                         
				}                                                               
				return data;                                                    
			})()                                                                
		}]                                                                      
	});  
}
$scope.initChartslink();
});

