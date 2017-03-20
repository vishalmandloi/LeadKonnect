(function () {
    'use strict';
    angular.module('app')
      .controller('notificationsCtrl', notificationsCtrl);

    function notificationsCtrl($scope, $http, UserSrv, $state, $location, $modal, aPIInterFace, $q, alertService) {
        //var currentUser = UserSrv.get();

        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;

        vm.GetNotificationByType = GetNotificationByType;

        //--------GetLocumProfile-----------
        function GetNotificationByType() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "2") {
                LoaderStart();
                var objReq = {
                    recieverId: currentUser.userId,
                    recieverType: '2'
                }

                aPIInterFace.doServiceCall('Post', 'GetNotificationByType', objReq).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.notificationList = response.Result;
                        LoaderStop();
                    }
                    else {
                        alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });
            }
            else {
                alertService.add('danger', 'Invalid User');
                LoaderStop();
            }
        }

    }

})();
