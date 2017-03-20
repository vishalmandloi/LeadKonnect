(function () {
    'use strict';
    angular.module('app')
      .controller('PharmacyRequestCtrl', PharmacyRequestCtrl);

    function PharmacyRequestCtrl($scope, $state, StorageUtils, aPIInterFace, dialogs) {
        var vm = {};
        $scope.vm = vm;
        vm.GetPharmacyRequests = GetPharmacyRequests;
        vm.role = StorageUtils.getSync('role');
        vm.pharmacyList = [];
        vm.searchText = null;
        vm.confirmbox = confirmbox;
        vm.UpdateRequestStatus = UpdateRequestStatus;
        vm.SuccessMsg = null;
        vm.ErrorMsg = null;

        ///----GetAllPharmacyUsers for Admin
        function GetPharmacyRequests() {
            vm.pharmacyList = [];
            var obj = {
                PageNumber: 1,
                Searchword: vm.searchText
            };

            aPIInterFace.doServiceCall('Post', 'GetPharmacyRequests', obj, 'admin').then(function (response) {
                console.log(response)
                if (response.Success) {
                    vm.pharmacyList = response.Result;
                }
                else {
                    alert(response.Message)
                }
            });

        }

        //--------UpdateRequestStatus-----------
        function UpdateRequestStatus(d) {
            var dlg = dialogs.confirm('Confirmation', ' Are you sure, you want to Contact this?');
            dlg.result.then(function (btn) {
                LoaderStart();
                var obj = {
                    requestId: d.requestId
                }
                aPIInterFace.doServiceCall('Post', 'UpdateRequestStatus', obj, 'admin').then(function (response) {
                    console.log(response);
                    if (response.Success) {
                       
                        GetPharmacyRequests();
                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }

                });
            }, function (btn) {
            });

        }


        function confirmbox(action, obj) {
            vm.SuccessMsg = null;
            vm.ErrorMsg = null;
            var r = confirm("Are you sure,you want to " + action + ' this');
            if (r == true) {
                var obj = {
                    page: 'pharmacy',
                    colName: action,// == 'Delete' ? 'isDelete' : 'isActive',
                    value: (action == 'Block') ? false : true,//------In Delete and Block case: true else UnBlock Case: false
                    id: obj.pharmacyId
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
                            GetAllPharmacyUsers ();
                        }

                    }
                    else {
                        vm.ErrorMsg = response.Message;
                    }
                });

            }
        }



    }


})();
