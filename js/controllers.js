(function () {
  "use strict";
  
  function SettingsDialogController($scope, $mdDialog, appData, serialport, server) {
    $scope.values = {
      serialSelected: serialport.getPort(),
      url: server.get(),
      ports: []
    };
    serialport.listPorts().then(
      function(data) {
        $scope.values.ports = data;
      },
      function(error) {
       console.log(error); 
      }
    );
    $scope.serialPortChange = function() {
      if ($scope.values.serialSelected !== null) {
       serialport.setPort($scope.values.serialSelected);
      }
    };
    $scope.serverUrlChange = function() {
      if ($scope.values.url !== null) {
       server.set($scope.values.url);
      }
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }
  
  function ManualEntryDialogController($scope, $mdDialog, appData) {
    $scope.values = {
      badgeId: null
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.submit = function() {
      $mdDialog.hide($scope.values.badgeId);
    };
  }
  
  angular
  .module('VotingApp.controllers', ['ngMaterial'])
  .controller('VotingMainCtrl', function ($scope, $mdDialog, timeouts, appData) {
    var showSettings = function(ev) {
          $mdDialog.show({
            controller: SettingsDialogController,
            templateUrl: '../templates/settings.html',
            targetEvent: ev,
          })
          .then(function(answer) {
            $scope.alert = 'You said the information was "' + answer + '".';
          }, function() {
            $scope.alert = 'You cancelled the dialog.';
          });
        };
    $scope.$on(
      'settings:none', 
      function(event){
        showSettings(event);
      }
    );
    $scope.showSettings = showSettings;

  })
  .controller('LoginCtrl', function ($scope, $rootScope, $mdDialog, timeouts, appData, users) {
    var checkSiteId = function(siteId) {
          var data = users.post({id: siteId});
        };
    
    $scope.showManualEntry = function(ev) {
      $mdDialog.show({
        controller:ManualEntryDialogController,
        templateUrl: '../templates/manual-entry.html',
        targetEvent: ev,
      })
      .then(function(siteId) {
        $scope.alert = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.alert = 'You cancelled the dialog.';
      });
      
    };
    
    $scope.$on(
      'barcode:data', 
      function(event, data){
        var siteId = data.split("|")[0];
        checkSiteId(siteId);
      }
    );
    
  });

}());