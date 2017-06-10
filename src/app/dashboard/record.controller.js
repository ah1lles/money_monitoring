(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('RecordController', RecordController);

  RecordController.$inject = ['$scope', '$state', '$stateParams', '$mdDialog', 'dashboardApi', 'flashMethods', 'moment', '_'];

  function RecordController($scope, $state, $stateParams, $mdDialog, dashboardApi, flashMethods, moment, _) {

    var
      vm = this,
      m  = moment(),
      defeult_total;

    vm.title                 = $stateParams.recordId ? 'Редактировать запись' : 'Создать запись';
    vm.submit_btn            = $stateParams.recordId ? 'Сохранить' : 'Создать';
    vm.add_total_input       = $stateParams.recordId ? true : false;
    vm.months                = moment.months();
    vm.years                 = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
    vm.current_months_index  = m.month();
    vm.new_record            = {};

    if (!$stateParams.recordId) {
      vm.new_record.month          = vm.months[vm.current_months_index];
      vm.new_record.days_in_month  = m.daysInMonth();
      vm.new_record.year           = m.year();
    } else {
      dashboardApi.getRecord($stateParams.recordId).then(
        function(response) {
          vm.new_record = response || {};
          defeult_total = vm.new_record.total;
        },
        function(response) {
          flashMethods.alertError('Извините, произошла ошибка!');
        }
      );
    }

    vm.update_total = function() {
      vm.new_record.total = vm.add_to_total ? (vm.new_record.total + vm.add_to_total) : defeult_total;
    }

    vm.save_record = function() {
      vm.recordForm.$setSubmitted();

      if (vm.recordForm.$invalid) return;

      var m = moment(vm.new_record.year + '-' + (vm.months.indexOf(vm.new_record.month) + 1), 'YYYY-MM');

      vm.new_record.days_in_month  = m.daysInMonth();
      vm.new_record.sum_in_day     = (vm.new_record.total / vm.new_record.days_in_month).toFixed(2);

      if ($stateParams.recordId) {
        dashboardApi.updateRecord($stateParams.recordId, vm.new_record).then(
          function(response) {
            defeult_total   = vm.new_record.total;
            vm.add_to_total = null;
            flashMethods.alertSuccess('Запись была успешно обновлена!');
          },
          function(response) {
            flashMethods.alertError('Извините, произошла ошибка!');
          }
        );
      } else {
        vm.new_record.created_at = m.startOf('month').toISOString();

        dashboardApi.addRecord(vm.new_record).then(
          function(response) {
            vm.back();
            flashMethods.alertSuccess('Запись была успешно создана!');
          },
          function(response) {
            flashMethods.alertError('Извините, произошла ошибка!');
          }
        );
      }

    }

    vm.back = function() {
      $state.go('dashboard', null, {reload: true});
    }

  }

})();
