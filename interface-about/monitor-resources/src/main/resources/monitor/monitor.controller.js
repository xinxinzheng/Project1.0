/*
 * Copyright (c) 2015 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/monitor/monitor.module','app/monitor/monitor.services'], function(s) {

  s.controller('rootMonitorCtrl', function($rootScope) {
    $rootScope['section_logo'] = 'assets/images/logo_monitor.jpg';
   // $rootScope.$apply();
  });

  s.controller('MonitorCtrl', function($scope, $state,MonitorInventorySvc, $timeout) {
    MonitorInventorySvc.getAllNodes().then(function(data) {
      $scope.data = data['0']['topology'][0];
$scope.myNode=$scope.data['node'];
$scope.mySwitch=[];//save the switches
$scope.myLink=$scope.data['link'];//save the links of switches
var lenNode=$scope.myNode.length;
for(var i=0;i<lenNode;i++)
{
var obj=$scope.myNode[i];
var nodeId=obj['node-id'];
if(nodeId.indexOf('openflow') >= 0)
{$scope.mySwitch.push(nodeId);}
}//end for lenNode



    });//end getAllNodes


	$scope.myDst=[];
	//$scope.selectedPort={src:"1",dst:"2"};
	$scope.selectedPort={src:"1",dst:"2",monitor:"3"};


	//find the dest-node after choose the switch
	$scope.findPort = function($event){
		var lenLink=$scope.myLink.length;
		$scope.myDst.splice(0);
		for(var i=0;i<lenLink;i++)
		{
			var dst=$scope.myLink[i]['destination']['dest-node'];
			if(($scope.myLink[i]['source']['source-node']==$scope.selectedPort.src) && (dst.indexOf('openflow') >= 0))
			{
				$scope.myDst.push(dst);
			}
		}
		if($scope.myDst.length>0){$scope.selectedPort.dst=$scope.myDst[0];}
	};

	$scope.startMonitor=function(item){//button click
		$scope.selectedPort.monitor=item;
		//alert("monitor="+$scope.selectedPort.monitor+",src="+$scope.selectedPort.src+"dst="+$scope.selectedPort.dst);
		var lenMyLink=$scope.myLink.length;

		$scope.sendSrc=null;$scope.sendDst=null;
		for(var i=0;i<lenMyLink;i++)
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





});//end monitorCtrl

	s.controller('detailMonitorCtrl', function ($scope,  LinkInventorySvc, $timeout, $interval,$state, MonitorInventorySvc,$stateParams) {
	
	$scope.selectedPort={src:"1",dst:"2",monitor:"3"};
	$scope.selectedPort.src = $stateParams.src;
	$scope.selectedPort.dst = $stateParams.dst;
	$scope.selectedPort.monitor = $stateParams.mnt;


      $scope.updated = 0;
      $scope.updated2= 0;
/*     function up_dt() {
            LinkInventorySvc.getAllNodes().then(function(data) {
                $scope.data=data[0].node;
               });

            }      
    
      for (var i=0;i<1000;i++){

               up_dt();


             $timeout(t_out(),5000);
       }*/

      $scope.$watch('data', function() {
        $scope.updated++;
       });
     $scope.$watch('data2', function() {
        $scope.updated2++;
       });

     /* function t_out(){
               LinkInventorySvc.getAllNodes().then(function(data) {
               $scope.data2=data[0].node;
                $scope.bwfun();
              $scope.lossRate.figlossRate($scope.selectedPort.src,$scope.selectedPort.dst);

                });
            }*/

          $interval(function () {

               LinkInventorySvc.getAllNodes().then(function(data) {
                $scope.data=data[0].node;
               });


               $timeout(function () {
           // $interval(function () {
               LinkInventorySvc.getAllNodes().then(function(data) {
               $scope.data2=data[0].node;
              $scope.bwfun($scope.selectedPort.src,$scope.selectedPort.dst);
              $scope.lossRate.figlossRate($scope.selectedPort.src,$scope.selectedPort.dst); 
                });
            },5000);


           }, 8000);
       /*figout bandwidth*/
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
    
        $scope.rate={
           figRate:function(portid){
           var rates=0;
           $scope.pre_bytes=$scope.bytes.figBytes(portid,$scope.data);
           $scope.curr_bytes=$scope.bytes.figBytes(portid,$scope.data2);
           rates=($scope.curr_bytes-$scope.pre_bytes)/5000;
                
              return rates;
          },//end figRate
         };//end rate

          /*$scope.bwfun=function(){
          // $scope.bdw=$scope.rate.figRate($scope.selectedPort.src);
          //if ($scope.bdw>$scope.rate.figRate($scope.selectedPort.dst)){
            //    $scope.bdw=$scope.rate.figRate($scope.selectedPort.dst);
          // }//end if
           $scope.bdw=($scope.rate.figRate($scope.selectedPort.src)+$scope.rate.figRate($scope.selectedPort.dst))/2*8/1024;
           return $scope.bdw;  
          };//end bwfun*/
        $scope.bwfun=function(port1,port2){
          
           $scope.bdw=($scope.rate.figRate(port1)+$scope.rate.figRate(port2))*8/2/1024;
           return $scope.bdw;  
          };//end bwfun



     /*figout loss rate*/
     $scope.tx_pkts={
             fig_tx_pkts:function(portid,data1){
               var tx_packets=0;
                for (var i=0; i<data1.length;  i++){
                var tmp=data1[i];
                var port_arr=tmp['node-connector'];
                for(var j=0; j<port_arr.length;j++){
                  var portId=port_arr[j].id;
                if(portId==portid){
                  tx_packets=port_arr[j]['opendaylight-port-statistics:flow-capable-node-connector-statistics']['packets']['transmitted'];                  }
                }
              }
              return tx_packets;
             },//end 
           };//end

      $scope.rx_pkts={
             fig_rx_pkts:function(portid,data1){
               var rx_packets=0;
                for (var i=0; i<data1.length;  i++){
                var tmp=data1[i];
                var port_arr=tmp['node-connector'];
                for(var j=0; j<port_arr.length;j++){
                  var portId=port_arr[j].id;
                if(portId==portid){
                  rx_packets=port_arr[j]['opendaylight-port-statistics:flow-capable-node-connector-statistics']['packets']['received'];
                }
                }
              }
              return rx_packets;
             },//end fig_rx_pkts 
           };//end rx_pkts


           $scope.lossRate={
           figlossRate:function(port1,port2){
           $scope.lossrate=0;
                 
                   var  pre_p1tx=$scope.tx_pkts.fig_tx_pkts(port1,$scope.data);
                   var  pre_p2rx=$scope.rx_pkts.fig_rx_pkts(port2,$scope.data);
                  
                   var  curr_p1tx=$scope.tx_pkts.fig_tx_pkts(port1,$scope.data2);
                   var  curr_p2rx=$scope.rx_pkts.fig_rx_pkts(port2,$scope.data2);
                   var dif_p1tx= curr_p1tx-pre_p1tx; 
                   var dif_p2rx= curr_p2rx-pre_p2rx; 
                
                   var  p1p2_lossRate= ( dif_p1tx-dif_p2rx)/ dif_p1tx;
                   if( p1p2_lossRate<0){
                    p1p2_lossRate=0;
                   }
              
                   $scope.lossrate=p1p2_lossRate*100;
       
          },//end figRate
           };//end rate



});//end detailMonitorCtrl



});//end define



                                                      
