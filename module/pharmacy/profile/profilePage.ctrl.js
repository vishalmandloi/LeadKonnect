(function () {
    'use strict';
    angular.module('app')
      .controller('ProfileCtrl', ProfileCtrl);
    function ProfileCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $filter, $stateParams,alertService, locumSrv) {

        var currentUser = JSON.parse(localStorage.getItem('app-user'));

        var vm = {};
        $scope.vm = vm;
        $scope.isFavorite = '';

        vm.GetLocumProfile = GetLocumProfile;
        vm.AddFavorite = AddFavorite;
        vm.RemoveFavorite = RemoveFavorite;

        GetLocumProfile();
        GetDocumentsAndDeclarations();
        
        //--------GetLocumProfile-----------
        function GetLocumProfile() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                var objReq = {
                    locumId: $stateParams.id
                }
                aPIInterFace.doServiceCall('Post', 'GetLocumProfile', objReq).then(function (response) {
                    if (response.Success) {
                        console.log(response);
                        vm.profileModel = response.Result;
                      // $modal.dismiss();
                        LoaderStop();
                        GetFavoriteList(response.Result.locumId);
                        vm.Ratingnum = _.range(0,parseInt(vm.profileModel.rating));
                        vm.EmptyRating = _.range(0,5-parseInt(vm.profileModel.rating));
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

        //--------GetDocumentsAndDeclarations-----------
        function GetDocumentsAndDeclarations() {

            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                var objReq = {
                    userId: $stateParams.id
                }

                aPIInterFace.doServiceCall('Post', 'GetDocumentsAndDeclarations', objReq).then(function (response) {
                    console.log(response)
                    if (response.Success) {
                        vm.DocDecModel = response.Result;
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

        function AddFavorite() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();

                var objReq = {
                    locumId: $stateParams.id,
                    pharmacyId: currentUser.userId,
                    isAdd: '1'
                }

                aPIInterFace.doServiceCall('Post', 'AddFavorite', objReq).then(function (response) {
                   console.log(response);
                    if (response.Success) {
                        vm.result = response.Result;
                        $scope.isFavorite = true;
                        // alert('Successfully added to your favorite');
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


        function GetFavoriteList(locumId){
            var objReq = {
                   query : {userId: currentUser.userId}
                    }
                aPIInterFace.doServiceCall('Get', 'GetFavoriteList', objReq).then(function (response) {
                    if (response.Result) {
                        angular.forEach(response.Result,function(favoriteUser){
                            if(favoriteUser.locumId == locumId){
                                $scope.isFavorite = true;
                            }
                        })
                    }
              });
        }

        function RemoveFavorite() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();

                var objReq = {
                    locumId: $stateParams.id,
                    pharmacyId: currentUser.userId,
                    isAdd: '0'
                }
                locumSrv.removeFavoriteList(objReq).then(function(response){
                    if (response.Success) {
                        vm.result = response.Result;
                        $scope.isFavorite = false;
                        //alert('Successfully removed from your favorite');
                        GetLocumProfile();
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

        vm.getRange = function(num,minusvalue){
             if(!num && num!=0) 
                return;

            if(minusvalue==0)
            {
             return _.range(0,parseInt(num));
            }
            else
            {
              return _.range(0,parseInt(minusvalue)-parseInt(num));  
            }
        }
    }
})();
