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
 .controller('chartsCtrl',function($rootScope,$scope){
 	$scope.hasLink = true;
 })
.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/monitor/datacharts");
    $stateProvider
    .state("monitor",{
        url:"/monitor",
        templateUrl:"/monitor.html",
    })
    .state('monitor.datacharts', {
            url: '/datacharts',
            templateUrl: 'datacharts.html',
    })
    .state('monitor.datalist', {
            url: '/datalist',
            templateUrl: 'datalist',
    })        
 
})




