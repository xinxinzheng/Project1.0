define(['angularAMD', 'app/routingConfig', 'Restangular','app/core/core.services','angular-translate', 'angular-translate-loader-static-files', 'common/config/env.module'], function(ng) {
  var monitor = angular.module('app.monitor', ['app.core','pascalprecht.translate', 'ui.router.state','restangular','config']);

  monitor.config(function($stateProvider, $translateProvider, NavHelperProvider, $compileProvider, $controllerProvider, $provide) {
       
     monitor.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };

      
    NavHelperProvider.addControllerUrl('app/monitor/monitor.controller');
    NavHelperProvider.addToMenu('monitor', {
      "link": "#/monitor/index",
      "title": "监控",
      "active": "main.monitor.*",
      "icon": "icon-link",
      "page": {
        "title": "monitor",
        "description": "monitor"
      }
    });

    var access = routingConfig.accessLevels;
	$stateProvider.state('main.monitor', {
      url: 'monitor',
      abstract: true,
      views : {
        'content' : {
          templateUrl: 'src/app/monitor/root.tpl.html',
          controller: 'rootMonitorCtrl'
        }
      }
    });

    $stateProvider.state('main.monitor.index', {
      url: '/index',
      access: access.admin,
      views : {
        '' : {
          templateUrl: 'src/app/monitor/monitor.tpl.html',
          controller: 'MonitorCtrl'
        }
      }
    });

   /*   $stateProvider.state('main.monitor.link', {
        url: '/link',
        access: access.admin,
        params:{"src":null,"dst":null,"mnt":null},
        views : {
            '' : {
                templateUrl: 'src/app/monitor/link.tpl.html',
                controller: 'LinkCtrl'
            }
        }
    });*/

 
	$stateProvider.state('main.monitor.detail', {
	url: '/detail',
	access: access.admin,
	params:{"src":null,"dst":null,"mnt":null},
	views : {

        '' : {
	
          templateUrl: 'src/app/monitor/detail.tpl.html',
          controller: 'detailMonitorCtrl'
        }
      }
	});


  });

  return monitor;
});


