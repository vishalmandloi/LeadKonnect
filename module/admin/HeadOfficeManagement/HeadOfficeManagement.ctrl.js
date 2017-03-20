(function () {
    'use strict';
    angular.module('app')
      .controller('HeadOfficeManagementCtrl', HeadOfficeManagementCtrl);

    function HeadOfficeManagementCtrl($scope, $state, StorageUtils, aPIInterFace, dialogs) {
        var vm = {};
        $scope.vm = vm;
        vm.GetAllHeadOffice = GetAllHeadOffice;
        vm.GetAllSubOffice = GetAllSubOffice;
        vm.role = StorageUtils.getSync('role');
        vm.subOfficeList = [];
        vm.searchText = null;
        vm.confirmbox = confirmbox;
        vm.SuccessMsg = null;
        vm.ErrorMsg = null;

        ///----GetAllHeadOffice for Admin
        function GetAllHeadOffice() {
            LoaderStart();
            vm.locumList = [];
            var obj = {
                PageNumber: 1,
                Searchword: vm.searchText
            };

            aPIInterFace.doServiceCall('Post', 'GetAllHeadOffice', obj, 'admin').then(function (response) {
                console.log(response);
                if (response.Success) {
                    vm.headOfficeList = response.Result;
                    LoaderStop();
                }
                else {
                    alert(response.Message);
                    LoaderStop();
                }
            });

        }

        ///----GetAllPharmacyUsers for Admin
        function GetAllSubOffice(d) {
            LoaderStart();
            vm.subOfficeList = [];
            var obj = {
                headOfficeId: d.headOfficeId
            };

            aPIInterFace.doServiceCall('Post', 'GetAllSubOffice', obj, 'admin').then(function (response) {
                console.log(response);
                if (response.Success) {
                    vm.subOfficeList = response.Result;
                    $('#subOfficeModal').modal('show');
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
                    id: d.headOfficeId
                };

                aPIInterFace.doServiceCall('Post', 'UpdateIsActiveAndIsDelete', obj, 'admin').then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        if (action == "Delete") {
                            vm.SuccessMsg = response.Message;
                            GetAllHeadOffice();
                        }
                        else {
                            vm.SuccessMsg = response.Message;
                            obj.isActive = !obj.isActive;
                            GetAllHeadOffice();
                        }

                    }
                    else {
                        vm.ErrorMsg = response.Message;
                    }
                });

            }, function (btn) {
            });
        }
    }


})();
