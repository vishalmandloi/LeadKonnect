(function () {
    'use strict';
    angular.module('app')
	.controller('AccountCtrl', AccountCtrl);

    function AccountCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q) {

        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var headOfficeId = currentUser.userId;
        var vm = {};
        $scope.vm = vm;
        vm.ActiveTab = ActiveTab;
        vm.active = 1;
        vm.regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        vm.UpdateHeadOffice = UpdateHeadOffice;
        vm.openSubofficeModal = openSubofficeModal;
        vm.CreateUpdateSubOffice = CreateUpdateSubOffice;
        vm.UpdatePharmacyPassword = UpdatePharmacyPassword;
        vm.UpdateShiftCharges = UpdateShiftCharges;
        vm.ukPostCodeRegex = /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;

        vm.headOfficeModel = {
            headOfficeId: null,
            companyName: null,
            firstName: null,
            lastName: null,
            emailId: null,
            password: null,
            mobileNumber: null,
            companyAddress: null,
            address2: null,
            city: null,
            postalCode: null,
            subOfficeList: []
        }

        vm.shiftChargeModel = {
            userId: null,
            emergencyShift: null,
            normalShift: null
        }

        vm.changePwdModel = {
            userId: null,
            oldPassword: null,
            newPassword: null
        }

        vm.confirmPassword = null;

        //----------Get Head office detail------------------------
        if (headOfficeId != undefined && headOfficeId != null && headOfficeId != '') {
            var obj = {
                headOfficeId: headOfficeId
            };

            aPIInterFace.doServiceCall('Post', 'GetHeadOfficeAccountInfo', obj).then(function (response) {
                if (response.Success) {
                    var data = response.Result;
                    if (data != null) {
                        vm.headOfficeModel = {
                            headOfficeId: data.headOfficeId,
                            companyName: data.companyName,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            emailId: data.emailId,
                            password: data.password,
                            mobileNumber: data.mobileNumber,
                            companyAddress: data.companyAddress,
                            address2: data.address2,
                            city: data.city,
                            postalCode: data.postalCode,
                            subOfficeList: data.subOfficeList
                        }

                        vm.shiftChargeModel.emergencyShift = data.emergencyShift;
                        vm.shiftChargeModel.normalShift = data.normalShift;
                    }

                }
                else {
                    alert(response.Message)
                }
            });
        }

        function ActiveTab(typ) {
            vm.active = typ;
            if (typ == 1) {

            } else if (typ == 2) {
                GetAllSubOffice();
            }
        }

        function UpdateHeadOffice() {
            if (vm.myDataForm.$valid) {
                LoaderStart();

                aPIInterFace.doServiceCall('Post', 'UpdateHeadOffice', vm.headOfficeModel).then(function (response) {
                    if (response.Success) {
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

        function CreateUpdateSubOffice() {
            if (vm.subOfficeDataForm.$valid) {
                LoaderStart();

                aPIInterFace.doServiceCall('Post', 'CreateUpdateSubOffice', vm.subOfficeModel).then(function (response) {
                    if (response.Success) {
                        GetAllSubOffice();
                        $('#subOfficeModal').modal('hide');
                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            } else {
                vm.subOfficeDataForm.submitted = true;
                LoaderStop();
            }
        }

        function GetAllSubOffice() {
            vm.subOfficeList = [];
            var obj = {
                headOfficeId: headOfficeId
            };

            aPIInterFace.doServiceCall('Post', 'GetAllSubOffice', obj).then(function (response) {
                console.log(response);
                if (response.Success) {
                    vm.subOfficeList = response.Result;
                }
                else {
                    alert(response.Message)
                }
            });

        }

        function confirmbox(action, d, key) {
            vm.SuccessMsg = null;
            vm.ErrorMsg = null;
            var r = confirm("Are you sure,you want to " + action + ' this');
            if (r == true) {
                LoaderStart();
                var obj = {
                    page: 'pharmacy',
                    colName: action,// == 'Delete' ? 'isDelete' : 'isActive',
                    value: (action == 'Block') ? false : true,//------In Delete and Block case: true else UnBlock Case: false
                    id: d.subOfficeId
                };

                if (d.subOfficeId != undefined && d.subOfficeId != null && d.subOfficeId != '') {
                    aPIInterFace.doServiceCall('Post', 'UpdateIsActiveAndIsDelete', obj, 'admin').then(function (response) {
                        if (response.Success) {
                            if (action == "Delete") {
                                vm.headOfficeModel.subOfficeList.splice(key, 1);
                                LoaderStop();
                            }
                        }
                        else {
                            alert(response.Message);
                            LoaderStop();
                        }
                    });
                } else {
                    vm.headOfficeModel.subOfficeList.splice(key, 1);
                    LoaderStop();
                }


            }
        }

        function openSubofficeModal(key, d) {
            if (key == 1) {
                vm.subOfficeModel = {
                    subOfficeId: null,
                    headOfficeId: headOfficeId,
                    areaName: null,
                    name: null,
                    email: null,
                    mobileNumber: null,
                    telNumber: null,
                    password: null,
                    address2: null,
                    city: null,
                    postalCode: null,
                }
            } else {
                vm.subOfficeModel = {
                    subOfficeId: d.subOfficeId,
                    headOfficeId: headOfficeId,
                    areaName: d.areaName,
                    name: d.name,
                    email: d.email,
                    mobileNumber: d.mobileNumber,
                    telNumber: d.telNumber,
                    password: d.password,
                    address2: d.address2,
                    city: d.city,
                    postalCode: d.postalCode,
                }
            }
            $('#subOfficeModal').modal('show');
        }

        function UpdatePharmacyPassword() {
            vm.passwordError = null;
            if (currentUser.userId != undefined && currentUser.userId != null) {
                if (vm.passwordDataForm.$valid) {
                    vm.changePwdModel.userId = currentUser.userId;

                    if (vm.changePwdModel.newPassword != vm.confirmPassword) {
                        vm.passwordError = 'Confirm password does not match!';
                        return false;
                    }

                    aPIInterFace.doServiceCall('Post', 'UpdatePharmacyPassword', vm.changePwdModel).then(function (response) {
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
                    vm.passwordDataForm.submitted = true;
                }
            }
            else {
                alert('Invalid User')
            }

        }

        function UpdateShiftCharges() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                if (vm.shiftDataForm.$valid) {
                    vm.shiftChargeModel.userId = currentUser.userId;
                    aPIInterFace.doServiceCall('Post', 'UpdateShiftCharges', vm.shiftChargeModel).then(function (response) {
                        if (response.Success) {
                            alert(response.Message)
                        }
                        else {
                            alert(response.Message)
                        }
                    });
                } else {
                    vm.shiftDataForm.submitted = true;
                }
            }
            else {
                alert('Invalid User')
            }
        }
    }
})();
