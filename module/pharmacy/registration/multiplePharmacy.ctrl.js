(function () {
    'use strict';
    angular.module('app')
      .controller('multiplepharmacyCtrl', multiplepharmacyCtrl);

    function multiplepharmacyCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $state) {

        var vm = {};
        $scope.vm = vm;
        vm.MultiplePharmacySignup = MultiplePharmacySignup;
        vm.regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        vm.pharmacySignupModel = {
            pharmacyName: null,
            firstName: null,
            lastName: null,
            emailId: null,
            password: null,
            mobileNumber: null
        }

        vm.confirmPassword = null;

        function MultiplePharmacySignup() {
            if (vm.myDataForm.$valid) {
                LoaderStart();
                //if (vm.pharmacySignupModel.password != vm.confirmPassword) {
                //    vm.confirmPassword = null;
                //    vm.myDataForm = true;
                //} else {
                //    vm.myDataForm = false;
                //}

                var postData = {};


                console.log(vm.pharmacySignupModel);

                aPIInterFace.doServiceCall('Post', 'MultiplePharmacySignup', vm.pharmacySignupModel).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        $state.go('pharmacy1' + '.successRegistration');
                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            } else {
                vm.myDataForm.submitted = true;
                LoaderStop();
            }
        }
    }
})();
