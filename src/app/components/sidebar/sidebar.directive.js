(function(){

  'use strict';

  angular.
    module('moneyMonitoring').
    directive('mainSidebar', mainSidebar);

  mainSidebar.$inject = [];

  function mainSidebar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/sidebar/sidebar.html',
      controllerAs: 'sidebar',
      controller: function($scope) {
        $scope.mdSidenavInit();
      }
    }
  }


})();