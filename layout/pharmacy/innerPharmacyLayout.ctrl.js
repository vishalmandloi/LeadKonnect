(function () {
    'use strict';
    angular.module('app')
      .controller('innerPharmacyLayoutCtrl', innerUserLayoutCtrl);

    function innerUserLayoutCtrl($scope, $state, AuthSrv, StorageUtils, UserSrv, aPIInterFace, $location, $rootScope) {
        $scope.currentState = $state.current.name == 'user.dashboard' ? 1 : 0;

        var vm = {};
        $scope.vm = vm;
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        console.log(currentUser)
        vm.isSinglePharmacy = currentUser.isSinglePharmacy;
        vm.GetNotificationUnreadCount = GetNotificationUnreadCount;
        vm.logout = logout;
        vm.unreadCount = '';
        $scope.tab = 1;
        $rootScope.$on('$stateChangeStart', function (e, toState, currentState) {
           
            $scope.tab = toState.name == 'pharmacy.dashboard' ? 1 :
                         toState.name == 'pharmacy.createjobs' ? 2 :
                         toState.name == 'pharmacy.singlepharmacyprofile' ? 3 :
                         toState.name == 'pharmacy.jobs' ? 5 :
                         toState.name == 'pharmacy.finance' ? 6 :
                         toState.name == 'pharmacy.notifications' ? 7 :
                         toState.name == 'pharmacy.message' ? 8 :
                         toState.name == 'pharmacy.settings' ? 9 : 0;
            //alert($scope.tab)
            vm.GetNotificationUnreadCount();
        });

        function logout() {
            AuthSrv.logout().then(function () {
                UserSrv.delete();
                $state.go('user1.home');
                LoaderStop();
            });
        };

       

        $scope.setTab = function (newTab) {
            $location.hash("#pharmacyHeaderId");
            $scope.tab = newTab;
            $scope.clickStatus = false;

            if (newTab == 7)
                vm.unreadCount = '';

            if (newTab == 8)
                vm.msgUnreadCount = '';
        };

        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };

        $scope.clickStatus = false;

        $scope.openMenu = function () {
            $scope.clickStatus = true;
        };

        $scope.closeMenu = function () {
            $scope.clickStatus = false;
        };

        //-------GetNotificationUnreadCount-------
        function GetNotificationUnreadCount() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                var obj = {
                    recieverId: currentUser.userId,
                    recieverType: currentUser.userType
                }

                aPIInterFace.doServiceCall('Post', 'GetNotificationUnreadCount', obj).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.unreadCount = response.Result.notificationCount;
                        vm.msgUnreadCount = response.Result.messageCount;
                    }
                });
            }
            else {
                alertService.add('danger', 'Invalid User');
            }
        }

    };

})();
