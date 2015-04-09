(function () {
  "use strict";
    
    angular
    .module('VotingApp.services', [])
    .factory('users', function(Restangular) {
      return Restangular.all('api/authenticate');
    })
    .factory('sites', function(Restangular) {
      return Restangular.all('api/siteid');
    })
    .factory('serialport', function($rootScope, $q, appData) {
      var self = this;
      self.serialport = require('serialport');
      self.SerialPort = self.serialport.SerialPort;
      
      self.open = function(port) {
        port = port || self.getPort();
        var sp = new self.SerialPort(
              port, 
              {
                parser: self.serialport.parsers.readline("\n")
              }
            );

        sp.on("data", function (data) {
          $rootScope.$emit('serialport:data', data.toString('ascii'));
        });
      };
      
      self.listPorts = function() {
        var ports = [],
            deferred = $q.defer();
        self.serialport.list(
          function (error, results) {
            if (error) {
              return deferred.reject(error);
            } else {
              for (var i = 0; i < results.length; i++) {
                var item = results[i];
                ports.push({name: item.manufacturer, device: item.comName, pnpId: item.pnpId});
              }
              return deferred.resolve(ports);
            }

          }
        );
        return deferred.promise;
      };
      self.getPort = function() {
        return window.localStorage.getItem("port");
      };

      self.setPort = function(port) {
        window.localStorage.setItem("port", port);
        $rootScope.$emit('serialport:ready', port);
        return port;
      };
      
      return self;
    })
    .factory('server', function($rootScope, $q, appData) {
      var self = this;
  
      self.get = function() {
        return window.localStorage.getItem("serverUrl");
      };

      self.set = function(url) {
        window.localStorage.setItem("serverUrl", url);
        $rootScope.$emit('server:ready', url);
        return url;
      };
      
      return self;
    });

}());