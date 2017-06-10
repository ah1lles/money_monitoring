(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('SignInController', SignInController);

  SignInController.$inject = ['$scope', '$state', '$timeout', '$cookies', 'Auth', 'regExpEmail', 'outputErrors', '$mdToast'];

  function SignInController($scope, $state, $timeout, $cookies, Auth, regExpEmail, outputErrors, $mdToast) {

    var vm = this;

    vm.user           = {};
    vm.regExpEmail    = regExpEmail;
    vm.errors         = outputErrors.createNew();
    vm.email_errors   = ['user-not-found', 'invalid-email'];
    vm.password_erros = ['wrong-password', 'weak-password'];

    vm.login = function() {
      $scope.preloaderActiveClass(true);

      Auth.login(vm.user.email, vm.user.password).then(
        function(response) {
          vm.logged_user = Auth.getUser();

          $scope.preloaderActiveClass(false);

          if (!vm.logged_user.emailVerified) {
            vm.errors.inputErrors({email: 'Email адрес не подтвержден. Проверте почту.'});
            vm.send_again = $cookies.get('confirmation_send') ? false : true;
            $timeout(function() { Auth.logout(); }, 100);
          } else {
            $scope.$emit('login_animation');
            $state.go('dashboard');
          }
        },
        function(error) {
          $scope.preloaderActiveClass(false);

          var error_type = error.code.split('/')[1];

          if (_.contains(vm.email_errors, error_type))
            vm.errors.inputErrors({email: error.message});
          else if (_.contains(vm.password_erros, error_type))
            vm.errors.inputErrors({password: error.message});

          $scope.$apply();
        }
      );
    }

    vm.send_email = function() {
      Auth.sendEmailVerification(vm.logged_user).then(
        function(response) {
          var expire_date = new Date();
          expire_date.setDate(expire_date.getDate() + 1);

          vm.send_again = false;

          $cookies.put('confirmation_send', 'true', {'expires': expire_date});

          $mdToast.show(
            $mdToast.simple()
              .textContent('Сообщение отправлено! Проверте почту.')
              .position('top right')
              .hideDelay(5000)
          );
        },
        function(error) {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Ошибка! Сообщение не отправлено.')
              .position('top right')
              .hideDelay(5000)
          );
        }
      );
    }

  }

})();
