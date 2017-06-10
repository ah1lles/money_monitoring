(function() {

  'use strict';

  angular
    .module('moneyMonitoring')
    .filter('dateFilter', dateFilter);

  /** @ngInject */
  function dateFilter(moment, defaultDateFormat) {
    return function(item, column) {
      return column && column.type === 'date' ? moment(item).format(column.format || defaultDateFormat) : item;
    }
  }

})();
