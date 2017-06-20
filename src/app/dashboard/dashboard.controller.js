(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$state', '$mdDialog', 'dashboardApi', 'flashMethods', 'moment', 'toArray', '_'];

  function DashboardController($scope, $state, $mdDialog, dashboardApi, flashMethods, moment, toArray, _) {

    var
      vm = this,
      m  = moment();

    vm.list            = [];
    vm.items_per_page  = 12;
    vm.search_term     = '';

    vm.current_sort    = {
      column: 'created_at'
    };

    vm.searchParams = {
      searchTerm: '',
      format: 'MMMM YYYY'
    };

    vm.columns = [
      {
        name: 'date',
        label: 'Дата',
        type: 'date',
      },
      {
        name: 'total',
        label: 'Общая сумма',
        type: 'integer',
        sort: true
      },
      {
        name: 'sum_amounts',
        label: 'Всего потрачено',
        type: 'integer',
        sort: true
      },
      {
        name: 'residue_from_total',
        label: 'Остаток',
        type: 'integer',
        sort: true
      },
      {
        name: 'sum_in_day',
        label: 'Макс. в день',
        type: 'integer'
      }
    ];

    dashboardApi.list().then(
      function(response) {
        vm.list = toArray.create(response);
        vm.list = _.each(vm.list, function(item) {
          item.sum_amounts            = vm.get_sum_amounts(item.deductions, 'amount');
          item.residue_from_total     = item.total - item.sum_amounts;
        });

        vm.all_record_total    = vm.get_sum_amounts(vm.list, 'total');
        vm.all_record_result   = vm.get_sum_amounts(vm.list, 'sum_amounts');
        vm.all_record_residue  = vm.get_sum_amounts(vm.list, 'residue_from_total');
      },
      function(response) {
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

    vm.get_sum_amounts = function(list, columnName) {
      var keys = _.pluck(list, columnName);
      return _.reduce(keys, function(memo, num){ return memo + num; }, 0);
    }

    vm.add_record = function() {
      $state.go('dashboard.record');
    }

    vm.edit_record = function(recordId) {
      $state.go('dashboard.record', {recordId: recordId});
    }

    vm.add_deduction = function(recordId) {
      $state.go('dashboard.deduction', {recordId: recordId});
    }

    vm.deductions_list = function(recordId) {
      $state.go('dashboard.deductions_list', {recordId: recordId});
    }

    vm.close_dialog = function() {
      $mdDialog.cancel();
    }

    vm.remove_record = function(recordId, ev) {
      var
        confirm = $mdDialog.confirm()
            .title('Удаление записи')
            .textContent('Вы уверены, что хотите удалить запись?')
            .targetEvent(ev)
            .clickOutsideToClose(true)
            .ok('Удалить')
            .cancel('Нет');

      $mdDialog.show(confirm).then(
        function() {
          dashboardApi.removeRecord(recordId).then(
            function(response) {
              vm.list = _.reject(vm.list, {id: recordId});
              flashMethods.alertSuccess('Запись была успешно удалена!');
            },
            function(response) {
              flashMethods.alertError('Извините, произошла ошибка!');
            }
          );
        }
      );
    }

  }

})();
