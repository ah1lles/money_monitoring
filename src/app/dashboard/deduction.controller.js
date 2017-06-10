(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('DeductionController', DeductionController);

  DeductionController.$inject = ['$scope', '$state', '$stateParams', '$mdDialog', 'dashboardApi', 'flashMethods', 'moment', 'userMarks', '_'];

  function DeductionController($scope, $state, $stateParams, $mdDialog, dashboardApi, flashMethods, moment, userMarks, _) {

    var
      vm = this;

    vm.title           = $stateParams.deductionId ? 'Редактировать вычет' : 'Создать вычет';
    vm.submit_btn      = $stateParams.deductionId ? 'Сохранить' : 'Создать';
    vm.deduction       = {};
    vm.marks_list      = {};
    vm.from_state      = '';
    vm.from_params     = null;

    vm.back = function() {
      $state.go(vm.from_state, vm.from_params, {reload: true});
    }

    vm.set_deduction_date = function() {
      vm.deduction.created_at = vm.picker_date.toISOString();
    }

    if (!$stateParams.deductionId) {
      vm.picker_date     = new Date();
      vm.picker_min_date = moment().startOf('month')._d;
      vm.picker_max_date = moment().endOf('month')._d;

      vm.set_deduction_date();
    }

    $scope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams) {
      vm.from_state = fromState.name || 'dashboard';
      vm.from_params = toParams.recordId ? {recordId: toParams.recordId} : null;
    });

    if ($stateParams.recordId && $stateParams.deductionId) {
      dashboardApi.getDeduction($stateParams.recordId, $stateParams.deductionId).then(
        function(response) {
          vm.deduction       = response || {};
          vm.picker_date     = moment(vm.deduction.created_at)._d;
          vm.picker_min_date = moment(vm.deduction.created_at).startOf('month')._d;
          vm.picker_max_date = moment(vm.deduction.created_at).endOf('month')._d;
        },
        function(response) {
          flashMethods.alertError('Извините, произошла ошибка!');
        }
      );
    }

    userMarks.list().then(
      function(response) {
        vm.marks_list = response || {};
      },
      function() {
        flashMethods.alertError('Извините, произошла ошибка!');
      }
    );

    vm.save_deduction = function() {
      vm.deductionForm.$setSubmitted();

      if (vm.deductionForm.$invalid) return;

      if ($stateParams.deductionId) {
        dashboardApi.updateDeduction($stateParams.recordId, $stateParams.deductionId, vm.deduction).then(
          function(response) {
            flashMethods.alertSuccess('Вычет успешно обновлен!');
          },
          function() {
            flashMethods.alertError('Извините, произошла ошибка!');
          }
        );
      } else {
        dashboardApi.createDeduction($stateParams.recordId, vm.deduction).then(
          function(response) {
            vm.deduction = {};
            vm.deductionForm.$setPristine();
            vm.deductionForm.$setUntouched();
            flashMethods.alertSuccess('Вычет успешно создан!');
          },
          function() {
            flashMethods.alertError('Извините, произошла ошибка!');
          }
        );
      }
    }

  }

})();
