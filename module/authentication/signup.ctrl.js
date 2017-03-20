(function(){
  'use strict';
  angular.module('app')
  .controller('SignupCtrl', SignupCtrl);

  function SignupCtrl($scope, $state, $ionicPopup,AuthSrv,UserSrv,PushPlugin,ToastPlugin){
    var vm = {};
    $scope.vm = vm;
    $scope.customer = {};

    vm.goToLandingScreen = goToLandingScreen;

    $scope.$on('$ionicView.enter', function(viewInfo){

      AuthSrv.getRole().then(function(response){
        $scope.RoleId = _.result(_.find(response.data, function (result) { return result.RoleName === "customer" }), 'Id')
      });
    });

    function goToLandingScreen(customer){
      vm.error = '';
      if (customer.password !== customer.confirmPassword) {
        vm.error = 'Password amd confirmPassword should not be same';
        return;
      }
      var pushId = '';

      UserSrv.get().then(function(user){
        pushId = user.pushId

        var user = {
          "RoleId": $scope.RoleId || 0,
          "UserName": $scope.customer.userName,
          "RegisterId": pushId || 0,
          "LoginId": $scope.customer.email,
          "Password": $scope.customer.password,
          "IsActive": true,
          "CreatedDate": new Date(),
          "LastUpdated": new Date(),
          "Others": ""
        }
        
        vm.loading = true;
        AuthSrv.createUser(user).then(function(response){

          if (response.data == 0) {
              $scope.isUserAlreadyPresent=true;
              vm.error = ' Already User Present with userName or email'
              return;
          }
          user.Id = response.data || 0
          user.logged = true;
          UserSrv.set(user);
          AuthSrv.RegisterPushbot(user);
          
          PushPlugin.sendPush([pushId], {title:'register your devise',message:'regster seccssfully'}).then(function(sent){
            if(sent){
              ToastPlugin.show('Notification posted !');
            }
          });
         

          $state.go('app.dashboard');
          vm.loading = false;
        }, function(error){
          vm.error = error.data && error.data.message ? error.data.message : error.statusText;
          vm.loading = false;
        });

      });

    };
  }
})();