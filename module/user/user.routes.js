(function () {
    'use strict';
    angular.module('app')
      .config(configure);

    function configure($stateProvider) {
        $stateProvider
        .state('user1.home', {
            url: '/home',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'module/user/home/home.html',
                    controller: 'homeCtrl'
                }
            },
            data: {
                restrictAccess: ['notLogged']
            }
        })
             .state('user1.info', {
                 url: '/info/:id',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/user/home/info.html',
                         controller: 'infoCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })

          .state('user1.locumsignup', {
              url: '/locumsignup',
              cache: false,
              views: {
                  'menuContent': {
                      templateUrl: 'module/user/registration/locumRegistration.html',
                      controller: 'locumCtrl'
                  }
              },
              data: {
                  restrictAccess: ['notLogged']
              }
          })
             .state('user1.locumsignup2', {
                 url: '/locumsignup2',
                 cache: false,
                 views: {
                     'menuContent': {
                         templateUrl: 'module/user/registration/locumRegistration2.html',
                         controller: 'locumReg2Ctrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
         .state('user1.landing', {
             url: '/landing',
             cache: false,
             views: {
                 'menuContent': {
                     templateUrl: 'module/user/landing/landing.html',
                     controller: 'landingCtrl'
                 }
             },
             data: {
                 restrictAccess: ['notLogged']
             }
         })    
         .state('user.dashboard', {
             url: '/dashboard',
             cache: false,
             views: {
                 'menuInnerContent': {
                     templateUrl: 'module/user/dashboard/dashboard.html',
                     controller: 'dashboardCtrl'
                 }
             },
             data: {
                 restrictAccess: ['notLogged']
             }
         })
         .state('user.verify', {
            url: '/verify',
            cache: false,
            views: {
                'menuInnerContent': {
                    templateUrl: 'module/user/verify/verify.html',
                    controller: 'verifyCtrl'
                }
            },
            data: {
                restrictAccess: ['notLogged']
            }
        })
        .state('user.jobs', {
            url: '/jobs/:tab',
            cache: false,
            views: {
                'menuInnerContent': {
                    templateUrl: 'module/user/jobs/jobs.html',
                    controller: 'jobsCtrl'
                }
            },
            data: {
                restrictAccess: ['notLogged']
            }
        })
        .state('user.message', {
            url: '/message',
            cache: false,
            views: {
                'menuInnerContent': {
                    templateUrl: 'module/user/message/message.html',
                    controller: 'messageCtrl'
                }
            },
            data: {
                restrictAccess: ['notLogged']
            }
        })
        .state('user.profile', {
            url: '/profile',
            cache: false,
            views: {
                'menuInnerContent': {
                    templateUrl: 'module/user/profile/profile.html',
                    controller: 'profileCtrl'
                }
            },
            data: {
                restrictAccess: ['notLogged']
            }
        })
             .state('user.pharmacyProfile', {
                 url: '/pharmacyProfile/:id',
                 cache: false,
                 views: {
                     'menuInnerContent': {
                         templateUrl: 'module/user/profile/pharmacyProfile.html',
                         controller: 'pharmacyProfileCtrl'
                     }
                 },
                 data: {
                     restrictAccess: ['notLogged']
                 }
             })
         .state('user.createlead', {
             url: '/createlead/:tab',
             cache: false,
             views: {
                 'menuInnerContent': {
                     templateUrl: 'module/user/lead/createlead.html',
                     controller: 'leadCtrl'
                 }
             },
             data: {
                 restrictAccess: ['notLogged']
             }
         })
            .state('user.notifications', {
                url: '/notifications',
                cache: false,
                views: {
                    'menuInnerContent': {
                        templateUrl: 'module/user/notifications/notifications.html',
                        controller: 'notificationsCtrl'
                    }
                },
                data: {
                    restrictAccess: ['notLogged']
                }
            })
        .state('user.settings', {
            url: '/settings',
            cache: false,
            views: {
                'menuInnerContent': {
                    templateUrl: 'module/user/settings/settings.html',
                    controller: 'locumSettingsCtrl'
                }
            },
            data: {
                restrictAccess: ['notLogged']
            }
        });


    }


})();
