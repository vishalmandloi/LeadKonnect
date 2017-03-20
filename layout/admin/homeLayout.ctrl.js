(function () {
    'use strict';
    angular.module('app')
      .controller('adminLayoutCtrl', adminLayoutCtrl);

    function adminLayoutCtrl($scope, $state, AuthSrv, StorageUtils, $rootScope, aPIInterFace) {
        var vm = {};
        $scope.vm = vm;
        vm.error = null;
        vm.loding = false;
        vm.credentials = { userId: null, password: null, loginType: null };
        vm.login = login;
        vm.loginType = false;
       


        // GetPagesForDropdown();
        vm.GetPagesForDropdown = function() {
            aPIInterFace.doServiceCall('Post', 'GetPagesForDropdown', null, 'admin').then(function (response) {
                if (response.Success) {
                    vm.pageList = response.Result;
                    $rootScope.companyData = vm.pageList;
                }
                else {
                    alert(response.Message)
                }
            });
        }


        function login() {
            vm.error = null;
            vm.loading = true;
            vm.credentials.loginType = vm.loginType ? "1" : "0";

            console.log(vm.credentials)
            if (vm.credentials.userId != null && vm.credentials.password != null) {
                LoaderStart();

                AuthSrv.login(vm.credentials).then(function (response) {
                    console.log(response);

                    if (response.Success) {
                        var role = StorageUtils.getSync('role');

                        $state.go(role + '.dashboard');
                        vm.credentials.userId = '';
                        vm.credentials.password = '';
                        vm.error = null;
                        vm.loading = false;
                    } else {
                        alert(response.Message);
                    }
                }, function (error) {
                    vm.credentials.password = '';
                    vm.error = error.data && error.data.message ? error.data.message : error.statusText;
                    vm.loading = false;
                });
            } else {
                alert('Please enter credentials')
            }
        };
    }
})();
