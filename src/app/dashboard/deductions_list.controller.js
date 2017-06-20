(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('DeductionsListController', DeductionsListController);

  DeductionsListController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$mdDialog', 'dashboardApi', 'flashMethods', 'userMarks', 'moment',  'toArray', 'defaultDateFormat', '_'];

  function DeductionsListController($scope, $state, $timeout, $stateParams, $mdDialog, dashboardApi, flashMethods, userMarks, moment, toArray, defaultDateFormat, _) {

    var
      vm = this;

    vm.list         = [];
    vm.marks_list   = [];
    vm.search_term  = '';
    vm.current_mark = null;

    vm.current_sort = {
      column: 'created_at'
    };

    vm.columns = [
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

    vm.searchParams = {
      searchTerm: '',
      marksList: {},
      format: defaultDateFormat
    };

    dashboardApi.getRecord($stateParams.recordId).then(
      function(response) {
        vm.list    = toArray.create(response.deductions);
        vm.title   = 'Список вычетов на ' + response.month;
        vm.record  = response || {};

        var amounts = _.pluck(vm.list, 'amount');
        vm.deductions_result   = _.reduce(amounts, function(memo, num){ return memo + num; }, 0);
        vm.deductions_residue  = vm.record.total - vm.deductions_result;
      },
      function(response) {
        flashMethods.alertError('Извините, произошла ошибка!');
      }
    );

    userMarks.list().then(
      function(response) {
        vm.marks_list               = response || {};
        vm.searchParams.marksList   = vm.marks_list;
      },
      function() {
        flashMethods.alertError('Извините, произошла ошибка!');
      }
    );

    vm.update_result = function() {
      $timeout(function() {
        var amounts = _.pluck($scope.filtered_list, 'amount');
        vm.deductions_result   = _.reduce(amounts, function(memo, num){ return memo + num; }, 0);
        vm.deductions_residue  = vm.record.total - vm.deductions_result;
      }, 0);
    }

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
            .clickOutsideToClose(true)
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

    vm.searchFilter = function(params) {
      return function(item) {
        if (!params.searchTerm) return true;
        var result = [], mark, m, date;

        _.each(item, function(value, key) {
          if (key === '$$hashKey' || key === 'id') return;

          if (key === 'mark') {
            mark = params.marksList[value];
            if (mark) {
              if (~mark.name.toLowerCase().indexOf(params.searchTerm.toLowerCase()))
                result.push(key);
            }
          } else {
            if (~value.toString().indexOf(params.searchTerm)) {
              result.push(key);
            }
          }
        });

        return result.length;
      }
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
