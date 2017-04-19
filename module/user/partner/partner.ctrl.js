(function () {
    'use strict';
    angular.module('app')
      .controller('partnerCtrl', partnerCtrl);

    function partnerCtrl($scope, $http, UserSrv, $state, $location, $modal, aPIInterFace, $q, alertService) {
        //var currentUser = UserSrv.get();
        
        var vm = {};
        $scope.vm = vm;
        vm.currentUser = JSON.parse(localStorage.getItem('app-user'));
        vm.ResponseRequest = ResponseRequest;

        vm.init = function(){
            GetPartners();
        }

       function GetPartners(){
            LoaderStart();
            var objReq={
              userId:vm.currentUser.UserId
            }
            var body ={
                  query:objReq
               }

            aPIInterFace.doServiceCall('Get', 'GetPartners', body).then(function (response) {
                if (response.Success) {
                    LoaderStop();
                    vm.partners = response.Result;
                }
                else {
                    LoaderStop();
                }
            });
        }     

        function ResponseRequest(req, reqStatus){
                LoaderStart();
                var objReq={
                    PartnerId : req.PkId,
                    FromUserId : req.RequestFrom,  
                    RequestResponse : reqStatus,
                    UserId: vm.currentUser.UserId                   
                }
                aPIInterFace.doServiceCall('Post', 'ResponsePartnerRequest', objReq).then(function (response) {
                    if (response.Success) {
                        //alertService.add('success', response.Message);
                        GetPartners();
                        alert(response.Message);
                         LoaderStop();
                    } else {
                        //alertService.add('danger', response.Message);
                        alert(response.Message);
                        LoaderStop();
                    }
                });              
        }   

    }
})();
