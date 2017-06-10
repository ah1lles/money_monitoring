(function() {
  'use strict';

  // Application config
  var
    FBconfig = {
      apiKey:             "AIzaSyC-Jr_rmAy_8i0S97WbWlDPwtDQf2UInUM",
      authDomain:         "monitoring-37fdd.firebaseapp.com",
      databaseURL:        "https://monitoring-37fdd.firebaseio.com",
      projectId:          "monitoring-37fdd",
      storageBucket:      "monitoring-37fdd.appspot.com",
      messagingSenderId:  "375917001440"
    },
    appConfig = {},
    appStart  = false,
    appModule = angular.module('moneyMonitoring', ['ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'toastr', 'angularUtils.directives.dirPagination']);

  // Initialize Firebase
  firebase.initializeApp(FBconfig);

  // User auth state change callback
  firebase.auth().onAuthStateChanged(function(user) {
    appConfig.user = user ? (user.emailVerified ? user : null) : null;

    if (!appStart) {
      initApp();
      appStart = true;
    }
  });

  function initApp() {
    appConfig.db       = firebase.database(),
    appConfig.rootRef  = appConfig.db.ref(),
    appConfig.urlBase  = appConfig.rootRef.toString();

    angular.element(document).ready(function() {
      appModule.constant('appConfig', appConfig);
      angular.bootstrap(document, ['moneyMonitoring']);
    });
  }

})();
