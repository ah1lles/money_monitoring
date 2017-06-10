(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('SignUpController', SignUpController);

  SignUpController.$inject = ['$scope', '$state', '$cookies', '$location', 'Auth', '_', 'regExpEmail', 'outputErrors'];

  function SignUpController($scope, $state, $cookies, $location, Auth, _, regExpEmail, outputErrors) {

    var
      vm          = this,
      url_params  = $location.search(),
      oobCode     = url_params.oobCode;

    vm.user           = {};
    vm.regExpEmail    = regExpEmail;
    vm.errors         = outputErrors.createNew();
    vm.email_errors   = ['email-already-in-use', 'user-not-found', 'invalid-email'];
    vm.password_erros = ['wrong-password', 'weak-password'];

    vm.registration = function() {
      vm.signUpForm.password_confirmation.$setValidity('password_confirmation', angular.equals(vm.user.password, vm.user.password_confirmation));

      if (vm.signUpForm.$invalid) return;

      $scope.preloaderActiveClass(true);

      Auth.signUp(vm.user.email, vm.user.password).then(
        function(response) {
          $scope.preloaderActiveClass(false);

          Auth.sendEmailVerification().then(
            function() {
              var expire_date = new Date();
              expire_date.setDate(expire_date.getDate() + 1);

              $cookies.put('confirmation_send', 'true', {'expires': expire_date});
              $state.go('confirmation_email');
            }
          );
        },
        function(error) {
          $scope.preloaderActiveClass(false);

          var error_type = _.isNumber(error.code) ? 'weak-password' : error.code.split('/')[1];

          if (_.contains(vm.email_errors, error_type))
            vm.errors.inputErrors({email: error.message});
          else if (_.contains(vm.password_erros, error_type))
            vm.errors.inputErrors({password: error.message});

          $scope.$apply();
        }
      );
    }

    vm.confirm_email = function() {
      Auth.applyActionCode(oobCode).then(
        function(response) {
          determine_result(true);
        },
        function(error) {
          determine_result(false);
        }
      );
    }

    function determine_result(status) {
      vm.verify_status = status;
      vm.title   = status ? 'Регистрация завершена!' : 'Извините, произошла ошибка!';
      vm.content = status ? 'Ваша почта подтверждена. Теперь вы можете войти.' : 'Данная ссылка уже не доступна. Либо вы уже подтвердили вашу почту, либо истек срок действия данной ссылки.';
    }

    if (oobCode && $state.current.name === 'verify_email') {
      vm.confirm_email();
    }

  }

})();
