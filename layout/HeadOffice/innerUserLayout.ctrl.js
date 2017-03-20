(function () {
    'use strict';
    angular.module('app')
      .controller('innerHeadOfficeLayoutCtrl', innerHeadOfficeLayoutCtrl);

    function innerHeadOfficeLayoutCtrl($scope, $state, AuthSrv, StorageUtils, UserSrv) {
        $scope.currentState = $state.current.name == 'user.dashboard' ? 1 : 0;
        //console.log($scope.currentState);
        var vm = {};
        $scope.vm = vm;
        $scope.tab=1;

        vm.logout = logout;
        function logout() {
            AuthSrv.logout().then(function () {
                UserSrv.delete();
                $state.go('admin1.login');
                LoaderStop();
            });
        };

        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
            $scope.clickStatus = false;

        };


   $scope.clickStatus = false;

        $scope.openMenu = function () {
            $scope.clickStatus = true;
        };

        $scope.closeMenu = function () {
            $scope.clickStatus = false;
        };
    };

})();
