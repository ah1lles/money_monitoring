(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $state, Auth, appConfig) {

    $rootScope.preloaderClass = false;

    $rootScope.preloaderActiveClass = function(bool) {
      $rootScope.preloaderClass = bool;
    }

    $rootScope.headerHide = true;
    $rootScope.states_for_anonymous = ['home', 'sign_in', 'sign_up', 'confirmation_email', 'verify_email', 'confirm_email',
                                      'confirm_email_success', 'confirm_password', 'change_password_success', 'auth_action'];

    $rootScope.$on('$stateChangeSuccess', function(ev, toState) {
      $rootScope.headerHide = _.contains($rootScope.states_for_anonymous, toState.name);

      if (appConfig.user) {
        if ($rootScope.headerHide) {
          ev.preventDefault();
          $state.go('dashboard');
        }
      } else {
        if (!$rootScope.headerHide) {
          ev.preventDefault();
          $state.go('logout');
        }
      }
    });

  }

})();
