(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', '$state', '$mdDialog', 'flashMethods'];

  function SettingsController($scope, $state,  $mdDialog, flashMethods) {

    var
      vm = this;

    vm.navLinks = [
      {
        state: 'settings.profile',
        label: 'Профиль'
      },
      {
        state: 'settings.marks',
        label: 'Настройка меток'
      }
    ];

    vm.update_current_tab = function(currentState) {
      vm.current_item  = _.findWhere(vm.navLinks, {state: currentState});
      vm.selectedIndex = vm.navLinks.indexOf(vm.current_item);
    }

    vm.update_current_tab($state.current.name);

    $scope.$on('$stateChangeSuccess', function(ev, toState) {
      vm.update_current_tab(toState.name);
    });

  }

})();
