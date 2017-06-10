(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/auth/auth.html'
      })
      .state('logout', {
        url: '/logout',
        resolve: {
          userLogout: function($state, Auth) {
            // Auth.removeToken();
            Auth.logout().then(
              function(response) {
                $state.go('sign_in');
              },
              function(response) {
                $state.go('sign_in');
              }
            )
          }
        }
      })
      .state('auth_action', {
        url: '/auth_action',
        resolve: {
          redirect: function($state, $timeout, $location, $cookies, $q, $window) {
            var
              deferred      = $q.defer(),
              url_params    = $location.search(),
              absUrl        = $location.absUrl(),
              path          = $location.path(),
              mode          = url_params.mode,
              redirect_url  = '',
              url           = '';

            $timeout(function() {
              if (mode) {
                if (mode === 'verifyEmail')
                  redirect_url = '/sign_up/verify_email';
                else if (mode === 'resetPassword')
                  redirect_url = '/change_password';

                url = absUrl.replace(path, redirect_url);

                $window.location.href = url;
              } else {
                $state.go('home');
              }
            }, 0);

            deferred.reject();
            return deferred.promise;
          }
        }
      });

    $urlRouterProvider.otherwise(function($ingector) {
      var
        $state    = $ingector.get('$state'),
        appConfig = $ingector.get('appConfig'),
        redirect  = $state.current.name || (appConfig.user ? 'dashboard' : 'home');

      $state.go(redirect);
    });
  }

})();
