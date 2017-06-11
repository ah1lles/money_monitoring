(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('SettingsMarksController', SettingsMarksController);

  SettingsMarksController.$inject = ['$scope', '$state', '$mdDialog', 'flashMethods', 'userMarks'];

  function SettingsMarksController($scope, $state,  $mdDialog, flashMethods, userMarks) {

    var
      vm = this;

    vm.marks_list       = {};
    vm.mark             = {};
    vm.current_mark_id  = '';

    userMarks.list().then(
      function(response) {
        vm.marks_list = response || {};
      },
      function() {
        flashMethods.alertError('Извините, произошла ошибка!');
      }
    );

    vm.choose_mark = function(markId) {
      vm.current_mark_id  = vm.current_mark_id !== markId ? markId : '';
      vm.mark             = vm.current_mark_id ? vm.marks_list[vm.current_mark_id] : {};
    }

    vm.save_mark = function() {
      if (vm.saveMarkForm.$invalid) return;

      if (vm.current_mark_id) {
        userMarks.updateMark(vm.current_mark_id, vm.mark).then(
          function() {
          },
          function() {
            flashMethods.alertError('Извините, произошла ошибка!');
          }
        );
      } else {
        userMarks.addMark(vm.mark).then(
          function(response) {
            vm.marks_list[response.key] = angular.copy(vm.mark);
            vm.mark = {};
            vm.saveMarkForm.$setPristine();
            vm.saveMarkForm.$setUntouched();
          },
          function() {
            flashMethods.alertError('Извините, произошла ошибка!');
          }
        );
      }
    }

    vm.remove_mark = function(id, mark, ev) {
      ev.stopPropagation();

      var
        confirm = $mdDialog.confirm()
            .title('Удаление метки')
            .textContent('Вы уверены, что хотите удалить метку "' + mark.name + '"?')
            .targetEvent(ev)
            .clickOutsideToClose(true)
            .ok('Удалить')
            .cancel('Нет');

      $mdDialog.show(confirm).then(
        function() {
          userMarks.removeMark(id).then(
            function(response) {
              delete vm.marks_list[id];
              if (vm.current_mark_id === id) {
                vm.mark = {};
                vm.saveMarkForm.$setPristine();
                vm.saveMarkForm.$setUntouched();
              }
              flashMethods.alertSuccess('Метка была успешно удалена!');
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
