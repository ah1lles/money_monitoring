(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('DeductionsListController', DeductionsListController);

  DeductionsListController.$inject = ['$scope', '$state', '$stateParams', '$mdDialog', 'dashboardApi', 'flashMethods', 'userMarks', 'moment',  'toArray', '_'];

  function DeductionsListController($scope, $state, $stateParams, $mdDialog, dashboardApi, flashMethods, userMarks, moment, toArray, _) {

    var
      vm = this;

    vm.list         = [];
    vm.marks_list   = [];
    vm.search_term  = '';
    vm.current_mark = null;
    vm.current_sort = {
      column: 'created_at'
    };
    vm.columns     = [
      {
        name: 'created_at',
        label: 'Дата',
        type: 'date'
      },
      {
        name: 'mark',
        label: 'Метка',
        type: 'string'
      },
      {
        name: 'description',
        label: 'Описание',
        type: 'string'
      },
      {
        name: 'amount',
        label: 'Сумма',
        type: 'integer',
        sort: true
      }
    ];

    dashboardApi.getRecord($stateParams.recordId).then(
      function(response) {
        vm.list =  toArray.create(response.deductions);
        vm.title = 'Список вычетов на ' + response.month;
      },
      function(response) {
        flashMethods.alertError('Извините, произошла ошибка!');
      }
    );

    userMarks.list().then(
      function(response) {
        vm.marks_list = response || {};
      },
      function() {
        flashMethods.alertError('Извините, произошла ошибка!');
      }
    );

    vm.apply_sort = function(columnName) {
      if (vm.current_sort.name !== columnName)
        vm.current_sort.type   = '';

      vm.current_sort.type    = vm.current_sort.type ? (vm.current_sort.type === 'asc' ? 'desc': '') : 'asc';
      vm.current_sort.column  = vm.current_sort.type === 'desc' ? '-' + columnName : columnName;
      vm.current_sort.name    = columnName;

      if (!vm.current_sort.type)
        vm.current_sort.column = 'created_at';
    }

    vm.remove_deduction = function(deductionId, ev) {
      var
        confirm = $mdDialog.confirm()
            .title('Удаление вычета')
            .textContent('Вы уверены, что хотите удалить данный вычет?')
            .targetEvent(ev)
            .ok('Удалить')
            .cancel('Нет');

      $mdDialog.show(confirm).then(
        function() {
          dashboardApi.removeDeduction($stateParams.recordId, deductionId).then(
            function(response) {
              vm.list = _.reject(vm.list, {id: deductionId});
              flashMethods.alertSuccess('Вычет успешно удален!');
            },
            function(response) {
              flashMethods.alertError('Извините, произошла ошибка!');
            }
          );
        }
      );
    }

    vm.back = function() {
      $state.go('dashboard', null, {reload: true});
    }

    vm.add_deduction = function() {
      $state.go('dashboard.deduction', {recordId: $stateParams.recordId});
    }

    vm.edit_deduction = function(deductionId) {
      $state.go('dashboard.deduction', {recordId: $stateParams.recordId, deductionId: deductionId});
    }
  }

})();
