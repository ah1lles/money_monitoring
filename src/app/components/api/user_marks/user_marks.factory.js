(function(){
  'use strict';

  angular.
    module('moneyMonitoring').
    factory('userMarks', userMarks);

  userMarks.$inject = ['appConfig', 'DB'];

  function userMarks(appConfig, DB) {

    var
      userMarks = {},
      userId = appConfig.user.uid;

    userMarks.list = function() {
      return DB.get('users/' + userId + '/marks');
    }

    userMarks.addMark = function(value) {
      return DB.add('users/' + userId + '/marks', value);
    }

    userMarks.removeMark = function(id) {
      return DB.remove('users/' + userId + '/marks/' + id);
    }

    userMarks.updateRecord = function(value, id) {
      return DB.update('users/' + userId + '/marks/' + id, value);
    }


    return userMarks;
  }

})();
