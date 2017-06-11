(function() {
  'use strict';

  angular
    .module('moneyMonitoring')
    .config(httpProviderConfig)
    .config(materialThemeConfig)
    .config(datepickerConfig);

  /** @ngInject */
  function httpProviderConfig($logProvider, $httpProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    $httpProvider.interceptors.push(beautifyInterceptor);
  }

  function beautifyInterceptor($q, Preloader) {
    return {
      request: function(config) {
        Preloader.openPreloader();
        return config;
      },
      requestError: function(config) {
        Preloader.closePreloader();
        return $q.reject(config);
      },
      response: function(res) {
        Preloader.closePreloader();
        return res;
      },
      responseError: function(res) {
        Preloader.closePreloader();
        return $q.reject(res);
      }
    }
  }

  function materialThemeConfig($mdThemingProvider){

      var
        primaryBlueMap = $mdThemingProvider.extendPalette('blue', {
          '500': '#1088DE', // Default
          '600': '#1669b1'  // Hover
        }),
        accentGreenMap = $mdThemingProvider.extendPalette('light-green', {
          'A200': '#ABD036', // Default
          'A700': '#94b725', // Hover
          'contrastDefaultColor': 'light'
        }),
        warnRedMap = $mdThemingProvider.extendPalette('red', {
          '500': '#D94740', // Defalt
          '600': '#b32926'  // Hover
        }),
        bgGreyMap = $mdThemingProvider.extendPalette('grey', {
          '50': '#f2f2f2' // Default background
        });

      $mdThemingProvider.definePalette('primaryBlue', primaryBlueMap);
      $mdThemingProvider.definePalette('accentGreen', accentGreenMap);
      $mdThemingProvider.definePalette('warnRed', warnRedMap);
      $mdThemingProvider.definePalette('bgGrey', bgGreyMap);
      
      $mdThemingProvider
        .theme('default')
        .primaryPalette('primaryBlue')
        .accentPalette('accentGreen')
        .warnPalette('warnRed')
        .backgroundPalette('bgGrey');
    }

    function datepickerConfig($mdDateLocaleProvider, moment, defaultDateFormat) {
      moment.locale('ru');

      $mdDateLocaleProvider.months          = moment.months();
      $mdDateLocaleProvider.shortMonths     = moment.monthsShort();
      $mdDateLocaleProvider.days            = moment.weekdays();
      $mdDateLocaleProvider.shortDays       = moment.weekdaysMin();
      $mdDateLocaleProvider.firstDayOfWeek  = 1;

      $mdDateLocaleProvider.formatDate = function(date) {
        var m = moment(date);
        return m.isValid() ? m.format(defaultDateFormat) : date;
      };
    }



})();
