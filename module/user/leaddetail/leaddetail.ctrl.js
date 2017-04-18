(function () {
    'use strict';
    angular.module('app')
      .controller('leaddetailCtrl', leaddetailCtrl);

    function leaddetailCtrl($scope, $http, UserSrv, dialogs, aPIInterFace, $q, $location, commonSvc,$stateParams,alertService,StorageUtils) {
        var vm = {};
        $scope.vm = vm;
        vm.currentUser = JSON.parse(localStorage.getItem('app-user'));
        vm.LeadId = $stateParams.tab;
        vm.AddPartner = AddPartner;
        vm.OfferDescription = '';
        vm.MakeOffer = MakeOffer; 

        vm.init = function(){
	    	GetPostDetail();
        }

       function GetPostDetail(){
       		LoaderStart();
       		var objReq={
			  leadId:vm.LeadId,
              userId:vm.currentUser.UserId
       		}
			var body ={
                  query:objReq
               }

            aPIInterFace.doServiceCall('Get', 'GetPostsById', body).then(function (response) {
                if (response.Success) {
                	LoaderStop();
                    debugger
                    vm.postDetail = response.Result;
                }
                else {
                	LoaderStop();
                }
            });
        }

        function AddPartner(){
                LoaderStart();
                var objReq={
                	UserId:vm.currentUser.UserId,
                	PartnerId:vm.postDetail.UserId
                }
                aPIInterFace.doServiceCall('Post', 'AddPartner', objReq).then(function (response) {
                    if (response.Success) {
                        GetPostDetail();
                        alert(response.Message);
                         LoaderStop();
                    } else {
                        alert(response.Message);
                        LoaderStop();
                    }
                });  

       	 }

        function MakeOffer(){
                LoaderStart();
                var objReq={
                	UserId:vm.currentUser.UserId,
                	OfferDescription:vm.OfferDescription,
                	LeadId:vm.postDetail.LeadId
                }
                aPIInterFace.doServiceCall('Post', 'MakeOffer', objReq).then(function (response) {
                    if (response.Success) {
                        vm.OfferDescription ='';
                        GetPostDetail();
                        alert(response.Message);
                         LoaderStop();
                    } else {
                        alert(response.Message);
                        LoaderStop();
                    }
                });  

       	 }       	 

    }
})();
