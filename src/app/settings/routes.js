(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/settings/partials/settings.html',
        controller: 'SettingsController',
        controllerAs: 'settings'
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'app/settings/partials/profile.html',
        controller: 'SettingsProfileController',
        controllerAs: 'profile'
      })
      .state('settings.marks', {
        url: '/marks',
        templateUrl: 'app/settings/partials/marks.html',
        controller: 'SettingsMarksController',
        controllerAs: 'marks'
      });
  }

})();
