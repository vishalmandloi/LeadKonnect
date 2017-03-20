(function () {
	'use strict';
	angular.module('app')
	.controller('HeadOfficeDashboardCtrl', dashboardCtrl);

	function dashboardCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, officeSvc, branchSvc, jobsSvc, commonSvc) {

		var vm = {};
		$scope.vm = vm;
		var currentUser = JSON.parse(localStorage.getItem('app-user'));
		var total = 100;
        vm.active = 1;
        vm.showSubAccountDDL = false;
        vm.subOffices = [];
        vm.branches = [];
        vm.selectedSubOffice = {};
        vm.selectedBranch = {};
        vm.selectedMonth = {};
        vm.months = [];
        vm.years = [];
        vm.jobs = [];
        vm.selectedFilter = '0';
        vm.status = 0

		var profileStatus = {
			essentialDoc : '',
			identityInsurance: '',
			dbsCheck:'',
			declaration:'',
			itSystem:'',
			paymetAccDetail:'',
			localPrefSetting:''
		}

        vm.init = function(){
            getYears();
            getMonths();
            vm.getJobs();
            GetDashbaordDataForHeadOffice();
        }

        vm.onChangeFilterBy = function(){
            vm.showSubAccountDDL = false;
            vm.showBranchDDL = false;
            resetFilter();
            if (vm.selectedFilter === '2') {
                GetSubOffice();
                vm.showSubAccountDDL = true;
            }
        }

        function resetFilter(){
            vm.selectedSubOffice = {};
            vm.selectedBranch = {};
        }

        vm.onChangeSubAccount = function(subOffice){
            GetBranches(subOffice.subOfficeId);
            vm.showBranchDDL = true;
        }

        vm.ActiveTab = function(typ) {
            vm.active = typ;
            if (typ == 1) {
                vm.status = 0;
                
            }
            else if (typ == 2) {
                vm.status = 6;
            }

            else if (typ == 3) {
                vm.status = 7;
            }

            else if (typ == 4) {
                vm.status = 8;
            }
            else {
                 vm.status = 4;
            }
            vm.getJobs();
        }

        vm.getJobs = function(){
            LoaderStart();
            UserSrv.get().then(function(user){
                if (user && user.userId) {
                    var request = {
                      'adminId': user.userId,
                      'filterKey': (vm.selectedFilter === '0')? 1 : vm.selectedFilter,
                      'subAccountId': vm.selectedSubOffice.subOfficeId,
                      'branchId': vm.selectedBranch.branchId,
                      'status': vm.status,
                      'month': (vm.selectedMonth.key === 0) ? '' : vm.selectedMonth.key,
                      'year': (vm.selectedYear.key === 0) ? '' : vm.selectedYear.key,
                      'PageNumber': "1",
                      'Searchword': ""
                    }
                    jobsSvc.GetAllJobsForHeadOffice(request).then(function(res){
                        vm.jobs = res.Result;
                        LoaderStop();
                    });
                }
            })
        }

        /* private function */
        function getMonths(){
            vm.months = commonSvc.getMonths();
            vm.selectedMonth = vm.months[0];
        }
        

        function getYears(){
            vm.years = commonSvc.getYears();
            vm.selectedYear = vm.years[0];
        }

        function GetSubOffice() {
            LoaderStart();
            UserSrv.get().then(function(user){
                if (user && user.userId) {
                    officeSvc.GetSubOffices(user.userId).then(function(res){
                        if (res) {
                           vm.subOffices =  res.Result;
                        }
                        vm.subOffices.unshift({areaName : 'Select SubOffices', branchId : 0});
                        vm.selectedSubOffice = vm.subOffices[0];
                        LoaderStop();
                    })
                }
            })
        }

        function GetBranches(branchId){
            LoaderStart();
            if (branchId) {
                    branchSvc.GetBranches(branchId).then(function(res){
                        if (res) {
                           vm.branches =  res.Result;
                            
                        }
                        vm.branches.unshift({ODSCode : 'Select Branch', subOfficeId : 0});
                        vm.selectedBranch = vm.branches[0];
                         LoaderStop();
                    })
                }
        }

	    //--------GetDashbaordDataForHeadOffice-----------
        function GetDashbaordDataForHeadOffice() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                var obj = {
                    userId: currentUser.userId
                }

                aPIInterFace.doServiceCall('Post', 'GetDashbaordDataForHeadOffice', obj).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.dashboardData = response.Result;
                        LoaderStop();
                    }
                    else {
                        alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });
            }
            else {
                alert('Invalid User')
            }
        }

    }
})();
