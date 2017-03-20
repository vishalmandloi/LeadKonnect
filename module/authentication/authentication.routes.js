(function(){
  'use strict';
  angular.module('app')
    .config(configure);

  function configure($stateProvider){
    $stateProvider
      .state('login', {
      url: '/login',
      templateUrl: 'module/authentication/login.html',
      controller: 'LoginCtrl',
      data: {
        restrictAccess: ['notLogged']
      }
    })

    .state('forgot', {
      url: '/forgot',
      templateUrl: 'module/authentication/forgot.html',
      controller: 'ForgotCtrl',
      data: {
        restrictAccess: ['notLogged']
      }
    })

    .state('signup', {
      url: '/signup',
      templateUrl: 'module/authentication/signup.html',
      controller: 'SignupCtrl',
      data: {
        restrictAccess: ['notLogged']
      }
    })

    .state('superAdmin.change-password', {
      url: '/change-password',
      views: {
        'menuContent': {
          templateUrl: 'module/authentication/change-password.html',
          controller: 'ChangePasswordCtrl'
        }
      }
    })

    .state('admin.change-password', {
      url: '/change-password',
      views: {
        'menuContent': {
          templateUrl: 'module/authentication/change-password.html',
          controller: 'ChangePasswordCtrl'
        }
      }
    })

    .state('customer.change-password', {
      url: '/change-password',
      views: {
        'menuContent': {
          templateUrl: 'module/authentication/change-password.html',
          controller: 'ChangePasswordCtrl'
        }
      }
    })

  }
})();
