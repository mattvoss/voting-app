(function () {
  "use strict";
  
  angular
    .module('VotingApp', ['ui.router', 'angularMoment', 'ngMaterial', 'ngMdIcons', 'restangular', 'VotingApp.controllers', 'VotingApp.services'])
    .value('timeouts', {})
    .value('appData', {

    })
    .run(
      function($rootScope, $state, serialport, server, appData, Restangular) {
        $rootScope.$on('serialport:ready', 
          function(event, data){
            serialport.open();
          }
        );
        
        $rootScope.$on('server:ready', 
          function(event, data){
            Restangular.setBaseUrl(data);
          }
        );
        
        $rootScope.$on('serialport:data', 
          function(event, data){
            console.log(data);
            if ($state.current.name === "login") {
              $rootScope.$broadcast('barcode:data', data);
            }
          }
        );
        
        if (server.get() !== null && serialport.getPort() !== null) {
          Restangular.setBaseUrl(server.get());
          serialport.open();
          $state.transitionTo('login');
        } 
      }
    )
    .config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
      RestangularProvider.setBaseUrl('http://localhost:3001/api');
      $stateProvider
        .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "body.html",
          controller: 'VotingMainCtrl',
          resolve: {
          }
        })
        .state('login', {
          url: "/login",
          templateUrl: "login.html",
          controller: 'LoginCtrl'
        })
        .state('app.add', {
          url: "/add",
          views: {
            'menuContent': {
              templateUrl: "templates/search.html",
              controller: 'AddSearchCtrl'
            }
          }
        })
        .state('app.searches', {
          url: "/searches",
          views: {
            'menuContent': {
              templateUrl: "templates/searches.html",
              controller: 'SearchlistsCtrl'
            }
          },
          resolve: {
            searches: function($stateParams, Searches) {
              return Searches.getAll();
            }
          }
        })
        .state('app.edit', {
          cache: false,
          url: "/searches/:id/edit",
          views: {
            'menuContent': {
              templateUrl: "templates/search.html",
              controller: 'EditSearchCtrl'
            }
          },
          resolve: {
            search: function($stateParams, Searches) {
              return Searches.get($stateParams.id);
            },
            restaurant: function($stateParams, Searches, Restaurants, $q) {
              var deferred = $q.defer();
              Searches.get($stateParams.id).then(
                function(search) {
                  Restaurants.get(search.restaurant).then(
                    function(value) {
                      return deferred.resolve(value);
                    }
                  );
                }
              );

              return deferred.promise;
            }
          }
        })
        .state('app.settings', {
          url: "/settings",
          views: {
            'menuContent': {
              templateUrl: "templates/settings.html",
              controller: 'SettingsCtrl'
            }
          },
          resolve: {
            user: function(User) {
              return User.get();
            }
          }
        })
        .state('app.about', {
          url: "/about",
          views: {
            'menuContent': {
              templateUrl: "templates/about.html",
              controller: 'AboutCtrl'
            }
          },
          resolve: {
            user: function(User) {
              return User.get();
            }
          }
        });
  });
}());