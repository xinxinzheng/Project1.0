define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module'], function(ng) {
  var monitor = angular.module('app.monitor', ['app.core', 'ui.router.state','config']);

  monitor.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    monitor.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };


    NavHelperProvider.addControllerUrl('app/monitor/monitor.controller');
    NavHelperProvider.addToMenu('monitor', {
     "link" : "#/monitor",
     "active" : "main.monitor",
     "title" : "监控",
     "icon" : "",  // Add navigation icon css class here
     "page" : {
        "title" : "Monitor",
        "description" : "MONITOR"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.monitor', {
        url: 'monitor',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/monitor/monitor.tpl.html',
                controller: 'MonitorCtrl'
            }
        }
    });

  });

  return monitor;
});

