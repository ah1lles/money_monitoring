(function(){
  'use strict';

  angular.
    module('moneyMonitoring').
    provider('Preloader', Preloader);

  function Preloader() {
    var
      class_preloader = '.la-anim-10',
      element = angular.element(document.querySelector(class_preloader)),
      activation_class = 'la-animate',
      Preloader = {};

    Preloader.openPreloader = function(){
      element.addClass(activation_class);
    }

    Preloader.closePreloader = function(){
      element.removeClass(activation_class);
    }

    this.$get = function(){
      return Preloader;
    }
  }

})();
