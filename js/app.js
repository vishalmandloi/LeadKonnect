(function(){
  'use strict';
  angular.module('app', ['ui.router', 'ngAutocomplete', 'ui.bootstrap', 'ngTable','ui.calendar','dialogs.main','pascalprecht.translate','ngScrollbars', 'ui.tinymce', 'ngSanitize','vsGoogleAutocomplete','ngRateIt'])
    .config(configure)
    .run(runBlock);
    

  configure.$inject = ['$urlRouterProvider', '$provide', '$httpProvider'];
  function configure($urlRouterProvider, $provide, $httpProvider){
    // ParseUtilsProvider.initialize(Config.parse.applicationId, Config.parse.restApiKey);

    $urlRouterProvider.otherwise('/user1/home');

    // configure $http requests according to authentication
    $httpProvider.interceptors.push('AuthInterceptor');
  }


    function runBlock($rootScope, $state, AuthSrv, UserSrv, Config,StorageUtils){
      checkRouteRights();
      debugger
      function checkRouteRights(){
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
          if(toState && toState.data && Array.isArray(toState.data.restrictAccess)){
            var restricted = toState.data.restrictAccess;
            var logged = AuthSrv.isLogged();
            var role = StorageUtils.getSync('role');

            if(logged && restricted.indexOf('notLogged') > -1){
              event.preventDefault();
              $state.go('loading');
            } 
            else if(logged && toState.data.role && toState.data.role[0] != role){
              event.preventDefault();
              $state.go('loading');
            }
            else if(!logged && restricted.indexOf('logged') > -1){
              event.preventDefault();
              $state.go('loading');
            }
          }
        });
      }

    }

 
})();


function LoaderStart() {
    $('#loader').show();
}


function LoaderStop() {
    $('#loader').hide();
}
