(function(){

  'use strict';

  angular.
    module('moneyMonitoring').
    directive('inputErrors', inputErrors);

  inputErrors.$inject = [];

  function inputErrors() {
    return {
      restrict: 'A',
      require: ['?ngModel', '^?form'],
      link: function(scope, element, attrs, ctrls) {

        var
          form       = ctrls[1],
          input_name = attrs.name,
          ngModel;

        if (!form) return;

        ngModel = ctrls[0] || form[input_name];

        function addModelValidators() {
          if (!ngModel) return;

          ngModel.$validators[input_name] = function(modelValue, viewValue) {
            return true;
          }
        }

        addModelValidators();

        scope.$on('$errors', function(ev, errors) {
          if (!ngModel) return;

          ngModel.$setValidity(input_name, !_.has(errors, input_name));
          ngModel.$setTouched();
        });
      }
    }
  }


})();