(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', '$timeout', '$mdComponentRegistry'];

  function IndexController($scope, $timeout, $mdComponentRegistry) {

    var vm = this;

    $scope.mdSidenavInit = function() {
      $scope.toggle = angular.noop;
      $scope.isOpen = angular.noop;

      $mdComponentRegistry
        .when('sidebar-left')
        .then(function(sideNav){
          $scope.isOpen = angular.bind(sideNav, sideNav.isOpen );
          $scope.toggle = angular.bind(sideNav, sideNav.toggle );
        });
    }

    $scope.$on('login_animation', function() {
        vm.login_animation = true;
        $timeout(function() {
          vm.login_animation = false;
        }, 2000);
    });

  }

})();
