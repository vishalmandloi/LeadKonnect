(function(){
  'use strict';
  angular.module('app')
    .config(configure);

  function configure($stateProvider){
    $stateProvider
      .state('loading', {
      url: '/loading',
      cache:false,
      templateUrl: 'layout/loading.html',
      controller: 'LoadingCtrl'
    })
      
      .state('superAdmin', {
      url: '/superAdmin',
      cache:false,
      abstract: true,
      templateUrl: 'layout/menu.html',
      controller: 'MenuCtrl',
      data: {
        role:['superAdmin'],
        restrictAccess: ['logged'] 
      }
    })

      .state('admin1', {
      url: '/admin1',
      cache:false,
      abstract: true,
      templateUrl: 'layout/admin/homeLayout.html',
      controller: 'adminLayoutCtrl'
      })

         .state('admin', {
             url: '/admin',
             cache: false,
             abstract: true,
             templateUrl: 'layout/admin/innerUserLayout.html',
             controller: 'innerAdminLayoutCtrl'
         })

        .state('headoffice', {
            url: '/headoffice',
            cache: false,
            abstract: true,
            templateUrl: 'layout/HeadOffice/innerUserLayout.html',
            controller: 'innerHeadOfficeLayoutCtrl'
        })

      .state('user1', {
      url: '/user1',
      cache:false,
      abstract: true,
      templateUrl: 'layout/locum/homeLayout.html',
      controller: 'homeLayoutCtrl'
      })
      .state('user', {
          url: '/user',
          cache: false,
          abstract: true,
          templateUrl: 'layout/locum/innerUserLayout.html',
          controller: 'innerUserLayoutCtrl'
      })
        .state('locum', {
          url: '/locum',
          cache: false,
          abstract: true,
          templateUrl: 'layout/locum/innerLocumLayout.html',
          controller: 'innerLocumLayoutCtrl'
      })
         .state('pharmacy1', {
             url: '/pharmacy1',
             cache: false,
             abstract: true,
             templateUrl: 'layout/locum/homeLayout.html',
             controller: 'homeLayoutCtrl'
         })
    .state('pharmacy', {
        url: '/pharmacy',
        cache: false,
        abstract: true,
        templateUrl: 'layout/pharmacy/innerPharmacyLayout.html',
        controller: 'innerPharmacyLayoutCtrl'
    });


  }
})();
