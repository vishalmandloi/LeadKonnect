(function(){
  'use strict';
  angular.module('app')
    .controller('LoadingCtrl', LoadingCtrl);

  function LoadingCtrl($scope, $q, $timeout,AuthSrv,$state,StorageUtils){
    var vm = {};
    $scope.vm = vm;
    $scope.vm.redirect = redirect;

   
    function redirect(){
      $timeout(function(){
        debugger;
        if(AuthSrv.isLogged()){
          var role = StorageUtils.getSync('role');
          $state.go( role + '.dashboard');
        } else {
          debugger;
          $state.go('login');
        }
      }, 300);
    }
  }
})();
