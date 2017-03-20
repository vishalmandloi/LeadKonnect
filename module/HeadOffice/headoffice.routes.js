(function () {
    'use strict';
    angular.module('app')
      .config(configure);

    function configure($stateProvider) {
        $stateProvider
        .state('headoffice.dashboard', {
            url: '/dashboard',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'module/HeadOffice/dashboard/dashboard.html',
                    controller: 'HeadOfficeDashboardCtrl'
                }
            }
        })
         .state('headoffice.accountinfo', {
             url: '/accountinfo',
             cache: false,
             views: {
                 'menuContent': {
                     templateUrl: 'module/HeadOffice/Account/account.html',
                     controller: 'AccountCtrl'
                 }
             }
         });
    }
})();
