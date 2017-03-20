(function(){
  'use strict';
  angular.module('app')
    .controller('ForgotCtrl', ForgotCtrl);

  function ForgotCtrl($scope, $state, $ionicPopup,AuthSrv){
    var vm = {};
    $scope.vm = vm;

    vm.goToLandingScreen = goToLandingScreen;

    function goToLandingScreen(credentials){
      vm.loading = true;
      AuthSrv.forgot(credentials).then(function(response){
       
        var alertPopup = $ionicPopup.alert({
                 title: 'Forgot',
                 template: 'Temp password sent you mail'
               });
               alertPopup.then(function(res) {
                 $state.go('login');
               });
        vm.loading = false;
      }, function(error){
        vm.error = error.data && error.data.message ? error.data.message : error.statusText;
        vm.loading = false;
      });
    };
  }
})();
