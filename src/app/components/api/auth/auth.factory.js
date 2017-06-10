(function(){
  'use strict';

  angular.
    module('moneyMonitoring').
    factory('Auth', Auth);

  Auth.$inject = ['$cookies', '$state', 'firebase', '$q'];

  function Auth($cookies, $state, firebase, $q) {

    var Auth = {};

    Auth.login = function(email, password) {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    Auth.signUp = function(email, password) {
      return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    Auth.logout = function() {
      return firebase.auth().signOut();
    }

    Auth.getUser = function() {
      return firebase.auth().currentUser;
    }

    Auth.sendEmailVerification = function(user) {
      var
        user     = user || Auth.getUser(),
        deferred = $q.defer();

      user.sendEmailVerification().then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );

      return deferred.promise;
    }

    Auth.applyActionCode = function(oobCode) {
      var deferred = $q.defer();

      firebase.auth().applyActionCode(oobCode).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );

      return deferred.promise;
    }

    Auth.verifyPasswordResetCode = function(oobCode) {
      var deferred = $q.defer();

      firebase.auth().verifyPasswordResetCode(oobCode).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );

      return deferred.promise;
    }

    Auth.sendPasswordResetEmail = function(email) {
      var deferred = $q.defer();

      firebase.auth().sendPasswordResetEmail(email).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );

      return deferred.promise;
    }

    Auth.confirmPasswordReset = function(oobCode, password) {
      var deferred = $q.defer();

      firebase.auth().confirmPasswordReset(oobCode, password).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );

      return deferred.promise;
    }

    return Auth;
  }

})();
