(function () {
    'use strict';
    angular.module('app')
      .config(configure);

    function configure($stateProvider) {
        $stateProvider
                .state('pharmacy1.pharmacysignup', {
                    url: '/pharmacysignup',
                    cache: false,
                    views: {
                       'menuContent': {
                           templateUrl: 'module/pharmacy/registration/pharmacy_registration.html',
                           controller: 'pharmacyRegCtrl'
                       }
                    },
                    data: {
                       restrictAccess: ['notLogged']
                    }
                })
              .state('pharmacy1.singlepharmacysignup', {
                  url: '/singlepharmacysignup',
                  cache: false,
                  views: {
                      'menuContent': {
                          templateUrl: 'module/pharmacy/registration/singlePharmacy.html',
                          controller: 'singlepharmacyCtrl'
                      }
                  },
                  data: {
                      restrictAccess: ['notLogged']
                  }
              })
             .state('pharmacy1.multiplepharmacysignup', {
                 url: '/multiplepharmacysignup',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/pharmacy/registration/multiplePharmacy.html',
                         controller: 'multiplepharmacyCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
            .state('pharmacy1.successRegistration', {
                url: '/successRegistration',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'module/pharmacy/registration/successRegistration.html',
                        controller: 'multiplepharmacyCtrl'
                    }
                },
                data: {
                    restrictAccess: ['notLogged']
                }
            })

             .state('pharmacy.dashboard', {
                 url: '/dashboard',
                 cache: false,
                 views: {
                     'pharmacyInnerContent': {
                         templateUrl: 'module/pharmacy/dashboard/dashboard.html',
                         controller: 'pharmacyDashboardCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })

             .state('pharmacy.finance', {
                 url: '/finance/:tab',
                 cache: false,
                 views: {
                     'pharmacyInnerContent': {
                         templateUrl: 'module/pharmacy/finance/finance.html',
                         controller: 'financeCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
            .state('pharmacy.createjobs', {
                url: '/createjobs',
            cache: false,
            views: {
                'pharmacyInnerContent': {
                    templateUrl: 'module/pharmacy/jobs/createJobs.html',
                    controller: 'CreateJobsCtrl'
                }
            },
            data: {
                restrictAccess: ['notLogged']
            }
            })
             .state('pharmacy.jobs', {
                 url: '/jobs/:tab',
                 cache: false,
                 views: {
                     'pharmacyInnerContent': {
                         templateUrl: 'module/pharmacy/jobs/jobs.html',
                         controller: 'JobsCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
             .state('pharmacy.message', {
                 url: '/message',
                 cache: false,
                 views: {
                     'pharmacyInnerContent': {
                         templateUrl: 'module/pharmacy/message/message.html',
                         controller: 'MessageCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
             .state('pharmacy.profile', {
                 url: '/profile/:id',
                 cache: false,
                 views: {
                     'pharmacyInnerContent': {
                         templateUrl: 'module/pharmacy/profile/profilePage.html',
                         controller: 'ProfileCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
             .state('pharmacy.multiplepharmacyprofile', {
                 url: '/multiplepharmacyprofile',
                 cache: false,
                 views: {
                     'pharmacyInnerContent': {
                         templateUrl: 'module/pharmacy/profile/multiplePharmacyProfile.html',
                         controller: 'multiplePharmacyProfileCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
             .state('pharmacy.singlepharmacyprofile', {
                 url: '/singlepharmacyprofile',
                 cache: false,
                 views: {
                     'pharmacyInnerContent': {
                         templateUrl: 'module/pharmacy/profile/singlePharmacyProfile.html',
                         controller: 'singlePharmacyProfileCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
             .state('pharmacy.notifications', {
                 url: '/notifications',
                 cache: false,
                 views: {
                     'pharmacyInnerContent': {
                         templateUrl: 'module/pharmacy/notifications/notifications.html',
                         controller: 'notificationsPharmacyCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
            .state('pharmacy.settings', {
                url: '/settings',
                cache: false,
                views: {
                    'pharmacyInnerContent': {
                        templateUrl: 'module/pharmacy/settings/settings.html',
                        controller: 'settingsctrl'
                    }
                },
                data: {
                    restrictAccess: ['notLogged']
                }
            });


    }


})();
