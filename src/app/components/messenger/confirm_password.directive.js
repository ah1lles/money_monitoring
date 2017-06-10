(function(){

  'use strict';

  angular.
    module('moneyMonitoring').
    directive('confirmPassword', confirmPassword);

  confirmPassword.$inject = [];

  function confirmPassword() {
    return {
      restrict: 'A',
      require: ['?ngModel', '^?form'],
      scope: {
        regExp: '@'
      },
      link: function(scope, element, attrs, ctrls) {

        var
          form = ctrls[1],
          ngModel;

        if (!form) return;

        ngModel = ctrls[0] || form[attrs.name];

        if (ngModel) {
          ngModel.$validators.password_confirmation = function(modelValue, viewValue) {
            var
              value    = modelValue || viewValue,
              password = form.password.$modelValue || form.password.$viewValue;

            return value === password;
          }
        }
      }
    }
  }


})();