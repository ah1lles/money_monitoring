/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .constant('moment', moment)
    .constant('firebase', firebase)
    .constant('_', _)
    .constant('defaultDateFormat', 'L')
    .constant('regExpEmail', '^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$');

})();
