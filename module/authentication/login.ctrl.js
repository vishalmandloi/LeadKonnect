(function(){
  'use strict';
  angular.module('app')
    .controller('LoginCtrl', LoginCtrl);

  function LoginCtrl($scope, $state, AuthSrv,StorageUtils){
    var vm = {};
    $scope.vm = vm;

    vm.error = null;
    vm.loding = false;
    vm.credentials = {login: '', password: ''};
    vm.login = login;

    function login(credentials){
      vm.error = null;
      vm.loading = true;

      AuthSrv.login(credentials).then(function(response){
        
        var role = StorageUtils.getSync('role');

        if(response.IsLoginWithTempPassword)
        {
             $state.go(role + '.change-password');
        }
        else 
        {
            $state.go( role + '.dashboard'); 
        }

        vm.credentials.password = '';
        vm.error = null;
        vm.loading = false;
      }, function(error){
        vm.credentials.password = '';
        vm.error = error.data && error.data.message ? error.data.message : error.statusText;
        vm.loading = false;
      });
    };

  }
})();
