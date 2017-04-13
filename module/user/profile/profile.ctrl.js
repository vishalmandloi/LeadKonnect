(function () {
    'use strict';
    angular.module('app')
    .controller('profileCtrl', profileCtrl);

    function profileCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $state, getSetValues,$stateParams) {

        var vm = {};
        $scope.vm = vm;
        vm.currentUser = JSON.parse(localStorage.getItem('app-user'));
        vm.UserId = $stateParams.tab;

        vm.init = function(){
            GetUserDetail();
        }

       function GetUserDetail(){
            LoaderStart();
            var objReq={
              userId:vm.UserId,
              FromId:vm.currentUser.UserId
            }
            var body ={
                  query:objReq
               }

            aPIInterFace.doServiceCall('Get', 'GetUserDetails', body).then(function (response) {
                if (response.Success) {
                    LoaderStop();
                    vm.userDetails = response.Result;
                }
                else {
                    LoaderStop();
                }
            });
        }

    }
})();
