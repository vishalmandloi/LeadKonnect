(function () {
    'use strict';
    angular.module('app')
    .controller('locumCtrl', locumCtrl);

    function locumCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $state, getSetValues) {

        var vm = {};
        $scope.vm = vm;

        vm.LocumRegistration = LocumRegistration;
        vm.regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        vm.confirmPassword="";

        vm.signupModel = {
            "FirstName": "",
            "LastName": "",
            "EmailId": "",
            "Password": "",
            "GroupName": "",
            "UserType": "1",
            "LoginType": "1",
            "SocialId": "",
            "ProfilePic": "",
            "PhoneNumber": "",
            "IsActive": "",
            "rstKey": "",
            "UserId": "0"
        }

        function isNumberKey(evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if (charCode != 46 && charCode > 31
              && (charCode < 48 || charCode > 57))
                return false;

            return true;
        }
        function LocumRegistration() {

            if (vm.myDataForm.$valid) {
                LoaderStart();

                if (vm.signupModel.Password != vm.confirmPassword) {
                    vm.confirmPassword = null;
                    LoaderStop();
                    return false;
                } 

                if (vm.signupModel.GPHCNumber != vm.confirmGPHCNumber) {
                    vm.confirmGPHCNumber = null;
                    LoaderStop();
                    return false;
                } 


                var postData = {};
                postData.FromJson = JSON.stringify($scope.vm.signupModel);

                console.log($scope.vm.signupModel);

                aPIInterFace.doServiceCall('POST', 'users', $scope.vm.signupModel).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        //$state.go('user1' + '.home');
                        $state.go('user1.landing');
                        LoaderStop();

                    }
                    else {
                        alert(response.Message);
                        //alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });
            } else {
                vm.myDataForm.submitted = true;
            }
        }
    }
})();
