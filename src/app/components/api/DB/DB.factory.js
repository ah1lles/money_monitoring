(function(){
  'use strict';

  angular.
    module('moneyMonitoring').
    factory('DB', DB);

  DB.$inject = ['$rootScope', '$timeout', 'appConfig', '$q'];

  function DB($rootScope, $timeout, appConfig, $q) {

    var DB = {};

    DB.get = function(url) {
      $rootScope.preloaderActiveClass(true);

      var deferred = $q.defer();

      appConfig.rootRef.child(url).once('value').then(
        function(response) {
          deferred.resolve(response.val());
          $timeout(function() { $rootScope.preloaderActiveClass(false); }, 0);
        },
        function(response) {
          deferred.reject(response);
          $timeout(function() { $rootScope.preloaderActiveClass(false); }, 0);
        }
      );

      return deferred.promise;
    }

    DB.add = function(url, params) {
      $rootScope.preloaderActiveClass(true);

      var
        deferred = $q.defer(),
        ref      = appConfig.db.ref(url);

      ref.push(params).then(
        function(response) {
          deferred.resolve(response);
          $timeout(function() { $rootScope.preloaderActiveClass(false); }, 0);
        },
        function(response) {
          deferred.reject(response);
          $timeout(function() { $rootScope.preloaderActiveClass(false); }, 0);
        }
      );

      return deferred.promise;
    }

    DB.remove = function(url) {
      $rootScope.preloaderActiveClass(true);

      var
        deferred = $q.defer(),
        ref      = appConfig.db.ref(url);

      ref.remove().then(
        function(response) {
          deferred.resolve(response);
          $timeout(function() { $rootScope.preloaderActiveClass(false); }, 0);
        },
        function(response) {
          deferred.reject(response);
          $timeout(function() { $rootScope.preloaderActiveClass(false); }, 0);
        }
      );

      return deferred.promise;
    }

    DB.update = function(url, params) {
      $rootScope.preloaderActiveClass(true);

      var
        deferred = $q.defer(),
        ref      = appConfig.db.ref(url);

      ref.update(params).then(
        function(response) {
          deferred.resolve(response);
          $timeout(function() { $rootScope.preloaderActiveClass(false); }, 0);
        },
        function(response) {
          deferred.reject(response);
          $timeout(function() { $rootScope.preloaderActiveClass(false); }, 0);
        }
      );

      return deferred.promise;
    }

    return DB;
  }

})();
