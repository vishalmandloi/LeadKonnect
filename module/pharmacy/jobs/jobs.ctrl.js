(function () {
    'use strict';
    angular.module('app')
      .controller('JobsCtrl', JobsCtrl);

    function JobsCtrl($scope, $http, UserSrv, $modal, dialogs, aPIInterFace, $q, $state, commonSvc, $stateParams) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        console.log(currentUser);
        var vm = {};
        $scope.vm = vm;
        vm.locumId = '';
        vm.pharmacyName = currentUser.userName;
        vm.isSinglePharmacy = currentUser.isSinglePharmacy;
        vm.GetPharmacyJob = GetPharmacyJob;
        vm.GetAppliedJobLocum = GetAppliedJobLocum;
        vm.GetBranchForDrobdown = GetBranchForDrobdown;
        vm.branchId = null;
        vm.ApprovJob = ApprovJob;
        vm.ActiveTab = ActiveTab;
        vm.confirmbox = confirmbox;
        vm.SearchJob = SearchJob;
        vm.init = init;
        vm.months = [];
        vm.years = [];
        vm.GetMessageForLocum = GetMessageForLocum;
        vm.openMessageBox = openMessageBox;
        vm.sendMessage = sendMessage;
        //vm.getLocum = getLocum


        //  function getLocum(data) {
        //  vm.locumId = data.locumId;
        // var url = $state.href('pharmacy.profile', {id:vm.locumId});
        //   window.open(url,'_blank');
        //  }
        reSet();
        function init() {
            reSet();
            getYears();
            getMonths();
            vm.GetPharmacyJob();
            vm.GetBranchForDrobdown();
        }

        function getMonths() {
            vm.months = commonSvc.getMonths();
            vm.selectedMonth = vm.months[0];
        }


        function getYears() {
            vm.years = commonSvc.getYears();
            vm.selectedYear = vm.years[0];
        }

        //--------SearchJob-----------
        function SearchJob() {
            GetPharmacyJob();
        }


        function reSet() {
            vm.active = $stateParams.tab;
            vm.jobReqModel = {
                pharmacyId: null,
                branchId: null,
                status: 0,
                filterType: null,
                month: null,
                year: null,
                date: null,
                PageNumber: 1,
                Searchword: null,


            }

        }
        vm.ConvertDate = function (d) {
            return new Date(d);
        }

        function ActiveTab(typ) {
            vm.jobReqModel.date = null;
            vm.active = typ;
            vm.jobReqModel.status = typ;
            GetPharmacyJob();
        }


        //--------GetPharmacyJob-----------
        function GetPharmacyJob() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                vm.jobList = [];

                vm.jobReqModel = {
                    pharmacyId: currentUser.userId,
                    status: vm.active,
                    filterType: null,
                    date: null,
                    PageNumber: vm.pageNumber,
                    Searchword: null,
                    month: vm.selectedMonth.key,
                    year: vm.selectedYear.key,
                    branchId: vm.branchId
                }

                aPIInterFace.doServiceCall('Post', 'GetPharmacyJob', vm.jobReqModel).then(function (response) {
                    console.log(response);
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
            else {
                alert('Invalid User')
            }
        }

        //--------GetBranchList-----------
        function GetBranchForDrobdown() {
            if (currentUser.userId != undefined && currentUser.userId != null && !currentUser.isSinglePharmacy) {
                LoaderStart();
                var objReq = {
                    userId: currentUser.userId
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

        //--------GetAppliedJobLocum-----------
        function GetAppliedJobLocum(d) {
            vm.appliedLocums = [];
            //LoaderStart();
            var obj = {
                jobId: d.jobId,
                status: d.jobStatus
            }
            aPIInterFace.doServiceCall('Post', 'GetAppliedJobLocum', obj).then(function (response) {

                if (response.Success) {
                    console.log(response);
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
                    console.log(response);
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
        function confirmbox(action, obj) {
            vm.SuccessMsg = null;
            vm.ErrorMsg = null;
            var r = confirm("Are you sure,you want to " + action + ' this');
            if (r == true) {
                var obj = {
                    page: 'jobs',
                    colName: action,// == 'Delete' ? 'isDelete' : 'isActive',
                    value: (action == 'Block') ? false : true,//------In Delete and Block case: true else UnBlock Case: false
                    id: obj.jobId
                };

                aPIInterFace.doServiceCall('Post', 'UpdateIsActiveAndIsDelete', obj, 'admin').then(function (response) {
                    console.log(response);
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

            }
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

        //--------SendMessage-----------
        function sendMessage(message) {

            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                vm.chat = {
                    jobId: $scope.chatData.jobId,
                    locumId: 0,
                    pharmacyId: currentUser.userId,
                    message: message,
                    type: currentUser.userType,
                }

                vm.messageResult.push({ message: message, locumName: currentUser.userName, pharmacyId: 0 });

                aPIInterFace.doServiceCall('Post', 'SaveMessages', vm.chat).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.messageData = response.Result;
                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            }
            else {
                alert('Invalid User')
            }
        }

        //--------OpenMessageBox-----------
        function openMessageBox(jobdata) {
            if (jobdata != null) {
                $scope.chatData = jobdata;
                $scope.chatData.locumName = currentUser.userName
                GetMessageForLocum();
            }
        }

        vm.messages = [];

        //--------GetMessage-----------
        function GetMessageForLocum() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                vm.messageData = {
                    jobId: $scope.chatData.jobId,
                    locumId: currentUser.userId,
                    PageNumber: 1,
                    Searchword: ''
                }

                aPIInterFace.doServiceCall('Post', 'GetMessageByJob', vm.messageData).then(function (response) {

                    if (response.Success) {
                        console.log(response)
                        vm.messageResult = response.Result;
                        LoaderStop();
                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            }
            else {
                alert('Invalid User')
            }
        }


        vm.getRange = function(num,minusvalue){
             if(!num && num!=0) 
                return;

            if(minusvalue==0)
            {
             return _.range(0,parseInt(num));
            }
            else
            {
              return _.range(0,parseInt(minusvalue)-parseInt(num));  
            }
        }


    }



})();
