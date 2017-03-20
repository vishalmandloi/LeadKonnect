(function () {
    'use strict';
    angular.module('app')
    .controller('singlepharmacyCtrl', singlepharmacyCtrl);

    function singlepharmacyCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $state, Config, alertService) {

        var vm = {};
        $scope.vm = vm;
        vm.SinglePharmacySignup = SinglePharmacySignup;
        vm.passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/;
        vm.regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        vm.ukPostCodeRegex = /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;


        vm.pharmacySignupModel = {
            pharmacyName: null,
            firstName: null,
            lastName: null,
            emailId: null,
            password: null,
            mobileNumber: null,
            phoneNumber:null,
            ODSCode: null,
            address1: null,
            address2: null,
            city: null,
            postalCode:null,
            GeographicCoordinates:[]
        }

        vm.confirmPassword = null;

        function SinglePharmacySignup() {
            if (vm.myDataForm.$valid) {
                LoaderStart();
                if (vm.pharmacySignupModel.password != vm.confirmPassword) {
                    vm.confirmPassword = null;
                    LoaderStop();
                    return false;
                } 


                var postData = {};
                
                aPIInterFace.doServiceCall('Post', 'pharmacy', vm.pharmacySignupModel).then(function (response) {
                    console.log(response);
                    // success = true and Result =1 is for valid new user
                    if (response.Success && response.Result == 1) {
                        $state.go('user1' + '.landing');
                        LoaderStop();
                    }
                    else {
                        LoaderStop();
                        alertService.add('danger', response.Message);
                    }
                });
            } else {
                vm.myDataForm.submitted = true;
                LoaderStop();
            }
        }


        vm.GetPharmacyDetail = function () {
            
                if(vm.pharmacySignupModel.ODSCode!='')
                {
                    var data = {
                        query : {
                            ODSCode : vm.pharmacySignupModel.ODSCode

                        }
                    }
                aPIInterFace.doServiceCall('Get', 'GetPharmacyDetailForSignUp', data).then(function (response) {
                   if (response.Result.Name!=null)
                    {
                       vm.pharmacySignupModel.pharmacyName = response.Result.Name;
                       vm.pharmacySignupModel.mobileNumber = response.Result.Phone;
                       vm.pharmacySignupModel.emailId = response.Result.Email;
                       vm.pharmacySignupModel.GeographicCoordinates = response.Result.GeographicCoordinates;
                    }
                });
            }
          
        }

        vm.getODScodes = function(query){
             return $http.get(Config.backendUrl + 'GetODSNumber', {
              params: {
                ODSCode: query,
                take: 10
              }
            }).then(function(response){
              return response.data.Result;
            });
        };
    }

})();
