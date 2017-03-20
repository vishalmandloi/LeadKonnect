(function () {
    'use strict';
    angular.module('app')
      .controller('CreateHeadOfficeCtrl', CreateHeadOfficeCtrl);

    function CreateHeadOfficeCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $state, $stateParams) {

        var vm = {};
        $scope.vm = vm;
        vm.CreateUpdateHeadOffice = CreateUpdateHeadOffice;
        vm.AddSubOffice = AddSubOffice;
        vm.confirmbox = confirmbox;
        vm.regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        vm.ukPostCodeRegex = /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;
        var headOfficeId = $stateParams.id;
        var dataWidth = 420;
        var totalLength = 0;

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
            postalCode:null,
            subOfficeList: []
        }

        vm.subOfficeModel = {
            subOfficeId: null,
            areaName: null,
            name: null,
            email: null,
            mobileNumber: null,
            telNumber: null,
            address2: null,
            city: null,
            postalCode: null,
        }

        if (headOfficeId != undefined && headOfficeId != null && headOfficeId != '') {
            var obj = {
                headOfficeId: headOfficeId
            };

            aPIInterFace.doServiceCall('Post', 'GetHeadOfficeById', obj, 'admin').then(function (response) {
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
                    }
                    totalLength = response.Result.subOfficeList.length;
                }
                else {
                    alert(response.Message)
                }
                headOfficeFun();
            });
        }

        
        function headOfficeFun(){
            var parentWidth = angular.element('.rf-form2 .rf-title').width();
            angular.element('.admin_edit_main').css('width',parentWidth);            
            dataWidth = 120 + totalLength*300; 
            angular.element('.admin_right').css('width',dataWidth);
            if(dataWidth > 1000){
                angular.element('.admin_edit_main').css('overflow-x','scroll');
            }
        }

        function AddSubOffice() {
            dataWidth = dataWidth + 300;
            vm.myDataForm.submitted = false;
            if (vm.myDataForm.$valid) {
                vm.subOfficeModel = {
                    subOfficeId: null,
                    areaName: null,
                    name: null,
                    email: null,
                    mobileNumber: null,
                    telNumber: null
                }
                angular.element('.admin_right').css('width',dataWidth);
                vm.headOfficeModel.subOfficeList.push(vm.subOfficeModel);
                if(dataWidth > 1000){
                    angular.element('.admin_edit_main').css('overflow-x','scroll');
                }
            } else {
                vm.myDataForm.submitted = true;
            }
           
        }

        function CreateUpdateHeadOffice() {
            if (vm.myDataForm.$valid) {
                LoaderStart();
                aPIInterFace.doServiceCall('Post', 'CreateUpdateHeadOffice', vm.headOfficeModel, 'admin').then(function (response) {
                    if (response.Success) {
                        $state.go('admin' + '.headofficemanagement');
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

        function confirmbox(action, d, key) {
            dataWidth = dataWidth - 300;
            vm.SuccessMsg = null;
            vm.ErrorMsg = null;
            var r = confirm("Are you sure,you want to " + action + ' this');
            if (r == true) {
                LoaderStart();
                console.log(dataWidth);
                angular.element('.admin_right').css('width',dataWidth);
                if(dataWidth < 1000){
                    angular.element('.admin_edit_main').css('overflow-x','hidden');
                }
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

        vm.CheckValidEmail = function (email, event) {

            if (email != '') {
                LoaderStart();
                var data = {
                    query: {
                        email: email
                    }
                }
                aPIInterFace.doServiceCall('Get', 'CheckValidEmail', data, 'admin').then(function (response) {
                    if (response.Success) {
                        LoaderStop();
                    } else {
                        $('#' + event.target.id).val(null);
                        alert(response.Message);
                        LoaderStop();
                    }
                });
            }

        }


    }
})();
