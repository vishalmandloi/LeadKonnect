(function () {
    'use strict';
    angular.module('app')
      .controller('jobmanagamentCtrl', jobmanagamentCtrl);

    function jobmanagamentCtrl($scope, $http, UserSrv, $modal, dialogs, aPIInterFace, $q, $state) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));

        var vm = {};
        $scope.vm = vm;
        vm.pharmacyName = currentUser.userName;
        vm.GetPharmacyJob = GetPharmacyJob;
        vm.GetAppliedJobLocum = GetAppliedJobLocum;
        vm.ApprovJob = ApprovJob;
        vm.ActiveTab = ActiveTab;
        vm.confirmbox = confirmbox;
        vm.GetPharmacyForDropdown = GetPharmacyForDropdown;

        reSet();
        function reSet() {
            vm.active = 0;
            vm.jobReqModel = {
                pharmacyId: null,
                status: 0,
                filterType: null,
                date: null,
                PageNumber: 1,
                Searchword: null

            }

        }
        vm.ConvertDate = function (d) {
            return new Date(d);
        }
         GetPharmacyJob();

        function ActiveTab(typ) {
            vm.jobReqModel.date = null;
            vm.active = typ;
            vm.jobReqModel.status = typ;
            GetPharmacyJob();
        }

        //--------GetPharmacyForDropdown-----------
        function GetPharmacyForDropdown() {
            LoaderStart();
            aPIInterFace.doServiceCall('Post', 'GetPharmacyForDropdown', null, 'admin').then(function (response) {

                if (response.Success) {

                    vm.phatmacyList = response.Result;
                    LoaderStop();
                }
                else {
                    alert(response.Message)
                    LoaderStop();
                }
            });
        }

        //--------GetBranchList-----------
        function GetPharmacyJob() {
            if (vm.jobReqModel.pharmacyId != undefined && vm.jobReqModel.pharmacyId != null && vm.jobReqModel.pharmacyId != '') {
                LoaderStart();
                vm.jobList = [];

                //vm.jobReqModel.pharmacyId = currentUser.userId;
                vm.jobReqModel.status = vm.active;
                vm.jobReqModel.pageNumber = vm.pageNumber;

                aPIInterFace.doServiceCall('Post', 'GetPharmacyJob', vm.jobReqModel).then(function (response) {

                    if (response.Success) {
                        vm.jobList = response.Result;
                        // $scope.refresh();
                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            }
        }

        //--------GetAppliedJobLocum-----------
        function GetAppliedJobLocum(d) {
            vm.appliedLocums = [];
            LoaderStart();
            var obj = {
                jobId: d.jobId,
                status: d.status
            }
            aPIInterFace.doServiceCall('Post', 'GetAppliedJobLocum', obj).then(function (response) {

                if (response.Success) {

                    vm.appliedLocums = response.Result;
                    LoaderStop();
                }
                else {
                    alert(response.Message)
                    LoaderStop();
                }
            });
        }

        //--------ApprovJob-----------
        function ApprovJob(d, typ) {
            var dlg = dialogs.confirm('Confirmation', ' Are you sure, you want to accept for this job?');
            dlg.result.then(function (btn) {
                LoaderStart();
                var obj = {
                    jobId: d.jobId,
                    locumId: d.locumId,
                    type: typ
                }
                aPIInterFace.doServiceCall('Post', 'ApproveJob', obj).then(function (response) {

                    if (response.Success) {
                        $('#waiting-locum').modal('hide');
                        GetPharmacyJob();
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

        //--------confirmbox-----------
        function confirmbox(action, d) {
            vm.SuccessMsg = null;
            vm.ErrorMsg = null;

            var dlg = dialogs.confirm('Confirmation', "Are you sure,you want to " + action + ' this');
            dlg.result.then(function (btn) {
                var obj = {
                    page: 'jobs',
                    colName: action,// == 'Delete' ? 'isDelete' : 'isActive',
                    value: (action == 'Block') ? false : true,//------In Delete and Block case: true else UnBlock Case: false
                    id: d.jobId
                };

                aPIInterFace.doServiceCall('Post', 'UpdateIsActiveAndIsDelete', obj, 'admin').then(function (response) {

                    if (response.Success) {
                        if (action == "Delete") {
                            vm.SuccessMsg = response.Message;
                            GetPharmacyJob();
                        }
                        else {
                            vm.SuccessMsg = response.Message;;
                            obj.isActive = !obj.isActive;
                            GetPharmacyJob();
                        }

                    }
                    else {
                        alert(response.Message)
                    }
                });

            }, function (btn) {
            });
        }

        //--------------Date picker ----------------------------
        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();

        $scope.openFromDatePicker = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.fromDateopened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.formats = ['fullDate', 'EEE, dd MMM yyyy'];
        $scope.format = $scope.formats[1];
    }

})();
