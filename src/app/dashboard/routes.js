(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/partials/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'dashboard'
      })
      .state('dashboard.record', {
        url: '/record/:recordId',
        templateUrl: 'app/dashboard/partials/record.html',
        controller: 'RecordController',
        controllerAs: 'record'
      })
      .state('dashboard.deductions_list', {
        url: '/record/:recordId/deductions',
        templateUrl: 'app/dashboard/partials/deductions_list.html',
        controller: 'DeductionsListController',
        controllerAs: 'deductions_list'
      })
      .state('dashboard.deduction', {
        url: '/record/:recordId/deductions/:deductionId',
        templateUrl: 'app/dashboard/partials/deduction.html',
        controller: 'DeductionController',
        controllerAs: 'deduction'
      });

  }

})();
