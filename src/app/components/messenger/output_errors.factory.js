(function(){

  'use strict';

  angular.
    module('moneyMonitoring').
    factory('outputErrors', outputErrors);

  outputErrors.$inject = ['$rootScope', '$mdDialog', '_'];

  function outputErrors($rootScope, $mdDialog, _) {

    var
      outputErrors = {};

    function Errors() {
      this.errors = {};
    }

    Errors.prototype.inputErrors = function(errors) {
      this.errors = angular.merge({}, errors);
      $rootScope.$broadcast('$errors', this.errors);
    }

    Errors.prototype.alertDialog = function(errors) {
      var
        title   = 'Ошибка!',
        cancel  = 'Закрыть',
        message = errors || 'Что-то пошло не так...',
        result  = '';

      return $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title(title)
          .textContent(message)
          .ok(cancel)
      );
    }

    outputErrors.createNew = function() {
      return new Errors();
    }

    return outputErrors;
  }


})();