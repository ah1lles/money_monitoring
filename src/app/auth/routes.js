(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('sign_in', {
        url: '/sign_in',
        templateUrl: 'app/auth/sign_in/partials/sign_in.html',
        controller: 'SignInController',
        controllerAs: 'sign_in'
      })
      .state('sign_up', {
        url: '/sign_up',
        templateUrl: 'app/auth/sign_up/partials/sign_up.html',
        controller: 'SignUpController',
        controllerAs: 'sign_up'
      })
      .state('confirmation_email', {
        url: '/sign_up/confirmation_email',
        templateUrl: 'app/auth/sign_up/partials/confirmation_email.html',
        resolve: {
          isEmail: function($state, $timeout, $cookies, $q) {
            var deferred = $q.defer();

            if ($cookies.get('confirmation_send')) {
              deferred.resolve();
            } else {
              deferred.reject();
              $timeout(function() { $state.go('home') }, 0);
            }
            return deferred.promise;
          }
        }
      })
      .state('verify_email', {
        url: '/sign_up/verify_email',
        templateUrl: 'app/auth/sign_up/partials/verify_email.html',
        controller: 'SignUpController',
        controllerAs: 'sign_up',
        resolve: {
          verifyEmail: function($state, $timeout, $cookies, $location, $q) {
            var
              deferred   = $q.defer(),
              url_params = $location.search(),
              mode       = url_params.mode;

            if (url_params.oobCode && mode === 'verifyEmail') {
              $cookies.remove('confirmation_send');
              deferred.resolve();
            } else {
              deferred.reject();
              $timeout(function() { $state.go('home') }, 0);
            }
            return deferred.promise;
          }
        }
      })
      .state('confirm_email', {
        url: '/confirm_email',
        templateUrl: 'app/auth/forgot_password/partials/confirm_email.html',
        controller: 'ForgotPasswordController',
        controllerAs: 'forgot_password'
      })
      .state('confirm_password', {
        url: '/change_password',
        templateUrl: 'app/auth/forgot_password/partials/confirm_password.html',
        controller: 'ForgotPasswordController',
        controllerAs: 'forgot_password',
        resolve: {
          checkCode: function($state, $timeout, $location, $q) {
            var
              deferred   = $q.defer(),
              url_params = $location.search(),
              mode       = url_params.mode;

            if (url_params.oobCode && mode === 'resetPassword') {
              deferred.resolve();
            } else {
              deferred.reject();
              $timeout(function() { $state.go('home') }, 0);
            }
            return deferred.promise;
          }
        }
      })
      .state('confirm_email_success', {
        url: '/confirm_email_success',
        templateUrl: 'app/auth/forgot_password/partials/confirm_email_success.html',
        resolve: {
          checkParamsCode: function($state, $timeout, $cookies, $q) {
            var deferred = $q.defer();

            if ($cookies.get('email_confirmation')) {
              deferred.resolve();
            } else {
              deferred.reject();
              $timeout(function() { $state.go('home') }, 0);
            }
            return deferred.promise;
          }
        }
      })
      .state('change_password_success', {
        url: '/change_password_success',
        templateUrl: 'app/auth/forgot_password/partials/change_success.html',
        resolve: {
          checkParamsCode: function($state, $timeout, $cookies, $q) {
            var deferred = $q.defer();

            if ($cookies.get('change_password')) {
              $cookies.remove('email_confirmation');
              deferred.resolve();
            } else {
              deferred.reject();
              $timeout(function() { $state.go('home') }, 0);
            }
            return deferred.promise;
          }
        }
      });
  }

})();
