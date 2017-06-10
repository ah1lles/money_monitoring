(function(){
  'use strict';

  angular.
    module('moneyMonitoring').
    factory('mainApi', mainApi);

  /** @ngInject */
  function mainApi($http, firebase, _) {

    var
      urlBase = firebase.database().ref().toString(),
      main = {};
// console.log(urlBase)
    _.each(['get', 'post', 'put', 'delete'], function(m){
      main[m] = function (url, _params) {
        var
          method = eval('$http.' + m + '(urlBase + url + ".json", m == "get" ? { params: _params } : _params);');

        return method
      };
    });

    return main;
  }

})();
