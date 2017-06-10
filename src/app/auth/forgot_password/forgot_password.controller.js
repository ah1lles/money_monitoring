(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('ForgotPasswordController', ForgotPasswordController);

  ForgotPasswordController.$inject = ['$scope', '$state', '$location', '$cookies', '$timeout', 'Auth', 'regExpEmail', 'outputErrors', '$mdToast'];

  function ForgotPasswordController($scope, $state, $location, $cookies, $timeout, Auth, regExpEmail, outputErrors, $mdToast) {

    var
      vm = this,
      url_params = $location.search(),
      oobCode    = url_params.oobCode;

    vm.user = {};
    vm.regExpEmail    = regExpEmail;
    vm.email_errors   = ['user-not-found', 'invalid-email'];
    vm.password_erros = ['wrong-password', 'weak-password'];
    vm.errors         = outputErrors.createNew();

    function determine_result(status) {
      vm.verify_status = status;
      vm.title   = status ? 'Восстановление пароля' : 'Извините, произошла ошибка!';
      vm.content = status ? 'Введите новый пароль.' : 'Данная ссылка уже не доступна.';
    }

    if (oobCode) {
      Auth.verifyPasswordResetCode(oobCode).then(
        function(response) {
          determine_result(true)
        },
        function(error) {
          determine_result(false);
        }
      );
    }

    vm.confirm_email = function() {
      if (vm.confirmEmailForm.$invalid) return;

      $scope.preloaderActiveClass(true);

      Auth.sendPasswordResetEmail(vm.user.email)
        .then(function(response) {
          $scope.preloaderActiveClass(false);
          $cookies.put('email_confirmation', 'true');
          $state.go('confirm_email_success');
        },
        function(error) {
          $scope.preloaderActiveClass(false);

          var error_type = error.code.split('/')[1];

          if (_.contains(vm.email_errors, error_type)) {
            vm.errors.inputErrors({email: error.message});
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent(error.message || 'Произошла ошибка!')
                .position('top right')
                .hideDelay(10000)
            );
          }

          $scope.$apply();
        }
      );
    }

    vm.confirm_password = function() {
      vm.confirmPasswordForm.password_confirmation.$setValidity('password_confirmation', angular.equals(vm.user.password, vm.user.password_confirmation));

      if (vm.confirmPasswordForm.$invalid) return;

      $scope.preloaderActiveClass(true);

      Auth.confirmPasswordReset(oobCode, vm.user.password).then(
        function(response) {
          $scope.preloaderActiveClass(false);

          var expire_date = new Date();
          expire_date.setMinutes(expire_date.getMinutes() + 2);

          $cookies.put('change_password', 'true', {'expires': expire_date});
          $state.go('change_password_success');
        },
        function(error) {
          $scope.preloaderActiveClass(false);

          var error_type = _.isNumber(error.code) ? 'weak-password' : error.code.split('/')[1];

          if (_.contains(vm.password_erros, error_type))
            vm.errors.inputErrors({password: error.message});

          $scope.$apply();
        }
      );
    }

  }

})();
