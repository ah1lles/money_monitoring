(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('profile_settings', {
        url: '/profile_settings',
        templateUrl: 'app/profile_settings/partials/profile_settings.html',
        controller: 'ProfileSettingsController',
        controllerAs: 'profile'
      });
  }

})();
