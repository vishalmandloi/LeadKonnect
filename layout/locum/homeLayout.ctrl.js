(function () {
    'use strict';
    angular.module('app')
      .controller('homeLayoutCtrl', homeLayoutCtrl);

    function homeLayoutCtrl($scope, $state, AuthSrv, StorageUtils, aPIInterFace) {
        debugger
        var vm = {};
        $scope.vm = vm;

        vm.error = null;
        vm.loding = false;
        vm.credentials = { userId: null, password: null, loginType: null };
        vm.login = login;
        vm.ForgotPassword = ForgotPassword;
        vm.loginType = false;

        function login() {
            vm.error = null;
            vm.loading = true;
            vm.credentials.loginType = vm.loginType ? "1" : "0";
            if (vm.credentials.userId != null && vm.credentials.password != null) {
                LoaderStart();

                AuthSrv.login(vm.credentials).then(function (response) {
                    debugger;
                    console.log(response)
                    if (response.Success) {
                       // $('#btnCloseLogin').click();
                        var role = StorageUtils.getSync('role');
                        if (response.Result.rstKey == "2") {
                            $state.go(role + '.verify');
                        } else {
                            $state.go(role + '.dashboard');
                        }

                        vm.credentials.userId = '';
                        vm.credentials.password = '';
                        vm.error = null;
                        vm.loading = false;
                        LoaderStop();
                    } else {
                        alert(response.Message);
                        LoaderStop();
                    }
                }, function (error) {
                    vm.credentials.password = '';
                    vm.error = error.data && error.data.message ? error.data.message : error.statusText;
                    vm.loading = false;
                    LoaderStop();
                });
            } else {
                // alert('Please enter credentials')
                LoaderStop();
            }
        };

        function ForgotPassword() {
            if (vm.credentials.userId != null && vm.credentials.userId != '') {

                LoaderStart();
                var obj = {
                    emailId: vm.credentials.userId
                }
                aPIInterFace.doServiceCall('Post', 'ForgotPassword', obj).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        $('#forgot-modal').modal('hide');
                        alert('Your password has been sent to your register email,please check your email!');
                       
                        LoaderStop();
                    }
                    else {
                        alert(response.Message);
                        LoaderStop();
                    }
                });
            } else {
                alert('Please enter emailId.');
            }
        }

    }
})();
