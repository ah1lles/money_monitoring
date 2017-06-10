(function(){

  'use strict';

  angular.
    module('moneyMonitoring').
    directive('mainHeader', mainHeader);

  mainHeader.$inject = ['appConfig'];

  function mainHeader(appConfig) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/header/header.html',
      controllerAs: 'header',
      controller: function() {
        var vm = this;

        vm.user_name = appConfig.user.name;
        console.log(appConfig.user)
      }
    }
  }


})();