(function(){

  'use strict';

  angular.
    module('moneyMonitoring').
    factory('toArray', toArray);

  toArray.$inject = ['_'];

  function toArray(_) {

    var
      toArray = {};

    toArray.create = function(obj) {
      return _.map(obj, function(value, key) {
        value.id = key;
        return value;
      });
    }

    return toArray;
  }


})();