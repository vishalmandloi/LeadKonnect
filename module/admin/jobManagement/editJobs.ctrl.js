(function () {
    'use strict';
    angular.module('app')
      .controller('EditJobCtrl', EditJobCtrl);

    function EditJobCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $state, $compile, $timeout, $filter, $stateParams) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var jobId = $stateParams.id;
        var pharmacyId = $stateParams.pid;
        console.log(currentUser);
        var vm = {};
        $scope.vm = vm;
        vm.CreateAJob = CreateAJobs;
        vm.GetBranchForDrobdown = GetBranchForDrobdown;
        vm.GetJobById = GetJobById;
        //vm.GetBranchName = GetBranchName;
        vm.housrList = ["00:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
        vm.JobTitleList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"]
        vm.Validate = Validate;
        console.log(vm.housrList);
        reSet();
        function reSet() {
            vm.JobModel = {
                jobId: null,
                branchId: null,
                userId: null,
                totalHour: null,
                costPerHours: 0,
                costPlaceholder: '£21 / hour',
                jobDescription: null,
                start: null,
                startTime: null,
                finishTime: null

            }
        }


        //--------GetBranchList-----------
        function GetBranchForDrobdown() {
            if (pharmacyId != undefined && pharmacyId != null && pharmacyId != "") {
                LoaderStart();
                var objReq = {
                    userId: pharmacyId
                }

                aPIInterFace.doServiceCall('Post', 'GetBranchForDrobdown', objReq).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.branchList = response.Result;
                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            }
            //else {
            //    alert('Invalid User')
            //}
        }

        function GetBranchName(d) {
            return $filter('filter')(vm.branchList, { id: d }, true)[0].value;
        }

        function Validate() {
            vm.timeError = null;
            if (vm.myDataForm.$valid) {
                console.log($scope.isShowing)
                $scope.isShowing = true;
                vm.branchName = GetBranchName(vm.JobModel.branchId);
            } else {
                $scope.isShowing = false;
            }
        }

        /* ***********CreateAJobs************** */
        function CreateAJobs() {
            vm.timeError = null;
            if (vm.myDataForm.$valid) {

                console.log(vm.JobModel);
                var validEntry = true;
                var dateExist = false;
                angular.forEach($scope.events, function (value, key) {
                    validEntry = true;
                    if (value.startTime == null || value.finishTime == null) {
                        validEntry = false;
                    }
                });
                if (validEntry) {
                    LoaderStart();
                    aPIInterFace.doServiceCall('Post', 'EditJobByAdmin', vm.JobModel, 'admin').then(function (response) {
                        if (response.Success) {
                            reSet();
                            $state.go('admin.jobmanagament');
                            LoaderStop();
                        }
                        else {
                            alert(response.Message)
                            LoaderStop();
                        }
                    });
                } else {
                    vm.timeError = 'Please fill your time slot';
                }

            } else {
                vm.myDataForm.submitted = true;
                LoaderStop();
            }
        }

        ///---------------------************************--------------------------------

        function GetJobById() {
            if (jobId != undefined && jobId != null && jobId != '') {
                LoaderStart();
                var objReq = {
                    jobId: jobId
                }

                aPIInterFace.doServiceCall('Post', 'GetJobById', objReq, 'admin').then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        var d = response.Result;

                        vm.JobModel = {
                            jobId: d.jobId,
                            branchId: d.branchId,
                            userId: d.userId,
                            totalHour: d.totalHour,
                            costPerHours: d.costPerHours,
                            costPlaceholder: '£21 / hour',
                            jobDescription: d.jobDescription,
                            start: new Date(d.start),
                            startTime: vm.housrList.indexOf(d.startTime),
                            finishTime: vm.housrList.indexOf(d.finishTime)

                        }
                        console.log(vm.JobModel);

                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            }
        }
        //else {
        //    alert('Invalid User')
        //}


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
