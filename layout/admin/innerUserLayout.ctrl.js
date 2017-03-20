(function () {
    'use strict';
    angular.module('app')
      .controller('innerAdminLayoutCtrl', innerAdminLayoutCtrl);

    function innerAdminLayoutCtrl($scope, $state, AuthSrv, StorageUtils, UserSrv, $rootScope,aPIInterFace) {
        $scope.currentState = $state.current.name == 'user.dashboard' ? 1 : 0;
        //console.log($scope.currentState);
        var vm = {};
        $scope.vm = vm;
        var companyData = $rootScope.companyData;


        // GetPagesForDropdown();
            vm.GetPagesForDropdown = function() {
            aPIInterFace.doServiceCall('Post', 'GetPagesForDropdown', null, 'admin').then(function (response) {
                    vm.pageList = response.Result;
                   // $rootScope.companyData = vm.pageList;
            });
        }


        vm.logout = logout;
        function logout() {
            AuthSrv.logout().then(function () {
                UserSrv.delete;
                $state.go('admin1.login');
                LoaderStop();
            });
        };

        $scope.clickStatus = false;

        $scope.openMenu = function(){
          $scope.clickStatus = true;
        };

        $scope.closeMenu = function(){
          $scope.clickStatus = false;
        };

        $scope.tab = 1;
        
        $scope.setTab = function(newTab){
          $scope.tab = newTab;
          $scope.clickStatus = false;
        };

        $scope.isSet = function(tabNum){
          return $scope.tab === tabNum;
        };

        /*$scope.goToCompany =function(data)
            {
                var temp = data.value; 
                var pageUrl = temp.replace(/\s/g, ""); 
                $state.go('content', {'key':pageUrl});
            }*/
    };

})();
