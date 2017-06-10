(function(){
  'use strict';

  angular.
    module('moneyMonitoring').
    factory('dashboardApi', dashboardApi);

  dashboardApi.$inject = ['appConfig', 'DB'];

  function dashboardApi(appConfig, DB) {

    var
      dashboardApi = {},
      userId = appConfig.user.uid;

    dashboardApi.list = function() {
      return DB.get('users/' + userId + '/list');
    }

    dashboardApi.getRecord = function(recordId) {
      return DB.get('users/' + userId + '/list/' + recordId);
    }

    dashboardApi.addRecord = function(value) {
      return DB.add('users/' + userId + '/list', value);
    }

    dashboardApi.removeRecord = function(recordId) {
      return DB.remove('users/' + userId + '/list/' + recordId);
    }

    dashboardApi.updateRecord = function(recordId, value) {
      return DB.update('users/' + userId + '/list/' + recordId, value);
    }

    dashboardApi.deductionsList = function(recordId) {
      return DB.get('users/' + userId + '/list/' + recordId + '/deductions');
    }

    dashboardApi.getDeduction = function(recordId, deductionId) {
      return DB.get('users/' + userId + '/list/' + recordId + '/deductions/' + deductionId);
    }

    dashboardApi.createDeduction = function(recordId, value) {
      return DB.add('users/' + userId + '/list/' + recordId + '/deductions', value);
    }

    dashboardApi.updateDeduction = function(recordId, deductionId, value) {
      return DB.update('users/' + userId + '/list/' + recordId + '/deductions/' + deductionId, value);
    }

    dashboardApi.removeDeduction = function(recordId, deductionId) {
      return DB.remove('users/' + userId + '/list/' + recordId + '/deductions/' + deductionId);
    }

    return dashboardApi;
  }

})();
