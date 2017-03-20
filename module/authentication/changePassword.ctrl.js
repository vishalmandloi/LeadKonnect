(function(){
  'use strict';
  angular.module('app')
    .controller('ChangePasswordCtrl', ChangePasswordCtrl);

  function ChangePasswordCtrl($scope, $state, $ionicPopup,AuthSrv,UserSrv){
    var vm = {};
    $scope.vm = vm;

    vm.goToLandingScreen = goToLandingScreen;


    $scope.$on('$ionicView.enter', function(viewInfo){
      getUser();
    });

    function getUser(){
      return UserSrv.get().then(function(user){
        vm.user = user;
      });
    };



    function goToLandingScreen(credentials){
      vm.loading = true;
      credentials.UserName = vm.user.UserName
      AuthSrv.changePassword(credentials).then(function(response){
        $state.go('app.dashboard');
        vm.loading = false;
      }, function(error){
        vm.error = error.data && error.data.message ? error.data.message : error.statusText;
        vm.loading = false;
      });
    };
  }
})();
