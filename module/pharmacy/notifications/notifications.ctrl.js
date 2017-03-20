(function () {
    'use strict';
    angular.module('app')
      .controller('notificationsPharmacyCtrl', notificationsPharmacyCtrl);

    function notificationsPharmacyCtrl($scope, $http, UserSrv, $state, $location, $modal, aPIInterFace, $q, alertService) {
        //var currentUser = UserSrv.get();

        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;

        vm.GetNotificationByType = GetNotificationByType;
        vm.SaveLocumRating = SaveLocumRating;

        function reset() {
            vm.ratingModel = {
                pharmacyId: null,
                locumId: null,
                rating: 0,
                comment: null,
                noficationId:0
            }
        }

        //--------GetLocumProfile-----------
        function GetNotificationByType() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                var objReq = {
                    recieverId: currentUser.userId,
                    recieverType: '4'
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

        //--------GetLocumProfile-----------
        function SaveLocumRating(d) {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                vm.ratingModel.pharmacyId = currentUser.userId;
                vm.ratingModel.jobId = d.jobId;
                vm.ratingModel.locumId = d.senderId;
                vm.ratingModel.noficationId=d.noficationId;

                aPIInterFace.doServiceCall('Post', 'SaveLocumRating', vm.ratingModel).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        alertService.add('success', response.Message);
                        vm.GetNotificationByType();
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
