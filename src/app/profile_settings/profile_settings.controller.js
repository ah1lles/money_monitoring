(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .controller('ProfileSettingsController', ProfileSettingsController);

  ProfileSettingsController.$inject = ['$scope', '$state', '$mdDialog', 'flashMethods', 'userMarks'];

  function ProfileSettingsController($scope, $state,  $mdDialog,  flashMethods, userMarks) {

    var
      vm = this;

    vm.marks_list = {};
    vm.mark = {};

    userMarks.list().then(
      function(response) {
        vm.marks_list = response || {};
      },
      function() {
        flashMethods.alertError('Извините, произошла ошибка!');
      }
    );

    vm.add_mark = function() {
      if (vm.addMarkForm.$invalid) return;

      userMarks.addMark(vm.mark).then(
        function(response) {
          vm.marks_list[response.key] = angular.copy(vm.mark);
          vm.mark = {};
          vm.addMarkForm.$setPristine();
          vm.addMarkForm.$setUntouched();
        },
        function() {
          flashMethods.alertError('Извините, произошла ошибка!');
        }
      );
    }

    vm.remove_mark = function(id, mark, ev) {
      var
        confirm = $mdDialog.confirm()
            .title('Удаление метки')
            .textContent('Вы уверены, что хотите удалить метку "' + mark.name + '"?')
            .targetEvent(ev)
            .ok('Удалить')
            .cancel('Нет');

      $mdDialog.show(confirm).then(
        function() {
          userMarks.removeMark(id).then(
            function(response) {
              delete vm.marks_list[id];
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
