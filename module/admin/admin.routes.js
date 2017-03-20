(function () {
    'use strict';
    angular.module('app')
      .config(configure);

    function configure($stateProvider) {
        $stateProvider
        .state('admin.dashboard', {
            url: '/dashboard',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'module/admin/dashboard/dashboard.html',
                    controller: 'DashboardCtrl'
                }
            }
        })

        .state('admin1.login', {
            url: '/login',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'module/admin/login/login.html',
                    controller: 'loginCtrl'
                }
            }
        })

        .state('admin.usermanagement', {
            url: '/usermanagement',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'module/admin/userManagement/userManagement.html',
                    controller: 'userManagementCtrl'
                }
            }
        })

             .state('admin.pharmacymanagement', {
                 url: '/pharmacymanagement',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/admin/pharmacyManagement/pharmacyManagement.html',
                         controller: 'pharmacyManagementCtrl'
                     }
                 }
             })
              .state('admin.pharmacyrequest', {
                  url: '/pharmacyrequest',
                  cache: false,
                  views: {
                      'menuContent': {
                          templateUrl: 'module/admin/PharmacyRequest/pharmacyRequest.html',
                          controller: 'PharmacyRequestCtrl'
                      }
                  }
              })

        .state('admin.financemanagement', {
            url: '/financemanagement',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'module/admin/FinanceManagement/financeManagement.html',
                    controller: 'financeManagementCtrl'
                }
            }
        })

        .state('admin.jobmanagament', {
            url: '/jobmanagament',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'module/admin/jobManagement/jobManagement.html',
                    controller: 'jobmanagamentCtrl'
                }
            }
        })
             .state('admin.editjob', {
                 url: '/editjob/:id/:pid',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/admin/jobManagement/editJobs.html',
                         controller: 'EditJobCtrl'
                     }
                 }
             })
             .state('admin.createheadoffice', {
                 url: '/createheadoffice',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/admin/HeadOfficeManagement/CreateHeadOffice.html',
                         controller: 'CreateHeadOfficeCtrl'
                     }
                 }
             })

             .state('admin.editheadoffice', {
                 url: '/editheadoffice/:id',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/admin/HeadOfficeManagement/CreateHeadOffice.html',
                         controller: 'CreateHeadOfficeCtrl'
                     }
                 }
             })
             .state('admin.headofficemanagement', {
                 url: '/headofficemanagement',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/admin/HeadOfficeManagement/HeadOfficeManagement.html',
                         controller: 'HeadOfficeManagementCtrl'
                     }
                 }
             })
             .state('admin.cmsmanagement', {
                 url: '/cmsmanagement',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/admin/CMSManagement/cmsManagement.html',
                         controller: 'cmsManagementCtrl'
                     }
                 }
             })
             .state('admin.settings', {
                 url: '/settings',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/admin/settings/settings.html',
                         controller: 'settingsCtrl'
                     }
                 }
             })
        .state('superAdmin.home', {
            url: '/home',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'module/user/home/home.html',
                    controller: 'homeCtrl'
                }
            }
        });


    }


})();
