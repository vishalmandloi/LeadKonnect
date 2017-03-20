(function () {
    'use strict';
   angular.module('app').controller('settingsctrl', settingsctrl);
function settingsctrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, locumSrv) {
    
    var currentUser = JSON.parse(localStorage.getItem('app-user'));
    var vm = {};
    $scope.vm = vm;
    vm.UpdatePharmacyPassword = UpdatePharmacyPassword;
    vm.GetFavoriteList = GetFavoriteList;
    vm.removeFavorite = removeFav;
    vm.favLocum = {};
    vm.totalStar ='';

    GetFavoriteList();

    vm.changePwdModel = {
        userId: null,
        oldPassword: null,
        newPassword: null
    }

    vm.confirmPassword = null;

    function UpdatePharmacyPassword(){
        vm.passwordError = null;
        if (currentUser.userId != undefined && currentUser.userId != null) {
            if (vm.myDataForm.$valid) {
                vm.changePwdModel.userId = currentUser.userId;

                if (vm.changePwdModel.newPassword != vm.confirmPassword) {
                    vm.passwordError = 'Confirm password does not match!';
                    return false;
                }

                aPIInterFace.doServiceCall('Post', 'UpdatePharmacyPassword', vm.changePwdModel).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.changePwdModel = {
                            userId: null,
                            oldPassword: null,
                            newPassword: null
                        }
                        vm.confirmPassword = null;

                        alert(response.Message)
                    }
                    else {
                        alert(response.Message)
                    }
                });
            } else {
                vm.myDataForm = true;
            }
        }
        else {
            alert('Invalid User')
        }
    }

    function GetFavoriteList(){
        var objReq = {
            query : {userId: currentUser.userId}
        }
        locumSrv.getFavoriteList(objReq).then(function (response) {
            console.log(response);
            vm.favLocum = response.Result;
            //angular.forEach(vm.favLocum,function(rating){
            //    rating.ratting =3;
            //})
            LoaderStop();
        })
                       
         
    }

     function removeFav(locumData){
        LoaderStart();
                var objReq = {
                    locumId: locumData.locumId,
                    pharmacyId: currentUser.userId,
                    isAdd: '0'
                }
               locumSrv.removeFavoriteList(objReq).then(function(response){
                 console.log(response);
                    if (response.Success) {
                     GetFavoriteList();
                    LoaderStop();   
                    } 
                })
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