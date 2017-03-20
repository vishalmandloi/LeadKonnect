(function () {
    'use strict';
    angular.module('app')
      .controller('pharmacyManagementCtrl', pharmacyManagementCtrl);

    function pharmacyManagementCtrl($scope, $state, StorageUtils, aPIInterFace, dialogs) {
        var vm = {};
        $scope.vm = vm;
        vm.GetAllPharmacyUsers = GetAllPharmacyUsers;
        vm.role = StorageUtils.getSync('role');
        vm.locumList = [];
        vm.searchText = null;
        vm.confirmbox = confirmbox;
        vm.SuccessMsg = null;
        vm.ErrorMsg = null;
        vm.OpenShiftChargeModal = OpenShiftChargeModal;
        vm.UpdateShiftCharges = UpdateShiftCharges;

        vm.shiftChargeModel = {
            pharmacyId: null,
            emergencyShift: null,
            normalShift: null
        }

        ///----GetAllPharmacyUsers for Admin
        function GetAllPharmacyUsers() {
            vm.locumList = [];
            var obj = {
                PageNumber: 1,
                Searchword: vm.searchText
            };

            LoaderStart();
            aPIInterFace.doServiceCall('Post', 'GetAllPharmacyUsers', obj, 'admin').then(function (response) {
                if (response.Success) {
                    vm.pharmacyList = response.Result;
                    LoaderStop();
                }
                else {
                    alert(response.Message)
                    LoaderStop();
                }
            });

        }

        function confirmbox(action, d) {
            vm.SuccessMsg = null;
            vm.ErrorMsg = null;
            var dlg = dialogs.confirm('Confirmation', "Are you sure,you want to " + action + ' this ?');
            dlg.result.then(function (btn) {
                var obj = {
                    page: 'pharmacy',
                    colName: action,// == 'Delete' ? 'isDelete' : 'isActive',
                    value: (action == 'Block') ? false : true,//------In Delete and Block case: true else UnBlock Case: false
                    id: d.pharmacyId
                };

                aPIInterFace.doServiceCall('Post', 'UpdateIsActiveAndIsDelete', obj, 'admin').then(function (response) {
                    if (response.Success) {
                        if (action == "Delete") {
                            vm.SuccessMsg = response.Message;
                            GetAllPharmacyUsers();
                        }
                        else {
                            vm.SuccessMsg = response.Message;
                            obj.isActive = !obj.isActive;
                            GetAllPharmacyUsers();
                        }

                    }
                    else {
                        vm.ErrorMsg = response.Message;
                    }
                });
            }, function (btn) {
            });
        }


        function OpenShiftChargeModal(d) {
            vm.shiftChargeModel = {
                pharmacyId: d.pharmacyId,
                emergencyShift: d.emergencyShift,
                normalShift: d.normalShift
            }
            $('#shiftChargeModal').modal('show');
        }

        function UpdateShiftCharges() {
            vm.myDataForm.submitted = false;
            if (vm.myDataForm.$valid) {
                LoaderStart();
                aPIInterFace.doServiceCall('Post', 'UpdateShiftCharges', vm.shiftChargeModel, 'admin').then(function (response) {
                    if (response.Success) {
                        GetAllPharmacyUsers();
                        $('#shiftChargeModal').modal('hide');
                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            } else {
                vm.myDataForm.submitted = true;
            }
        }


    }


})();
