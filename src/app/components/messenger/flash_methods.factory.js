(function(){

  'use strict';

  angular.
    module('moneyMonitoring').
    factory('flashMethods', flashMethods);

  flashMethods.$inject = ['$rootScope', '$mdToast', '_'];

  function flashMethods($rootScope, $mdToast, _) {

    var
      flashMethods = {};

    flashMethods.createAlert = function(type, message, delay, position) {
      return $mdToast.show({
          template  : '<md-toast class="md-toast ' + type +'"><div class="md-toast-content">' + message + '</div></md-toast>',
          hideDelay : delay || 3000,
          position  : position || 'top right'
        }
      );
    }

    flashMethods.alertSuccess = function(message, delay, position) {
      return flashMethods.createAlert('success', message, delay, position);
    }

    flashMethods.alertError = function(message, delay, position) {
      return flashMethods.createAlert('error', message, delay, position);
    }

    flashMethods.alertInfo = function(message, delay, position) {
      return flashMethods.createAlert('info', message, delay, position);
    }

    return flashMethods;
  }


})();