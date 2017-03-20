(function () {
    'use strict';
    angular.module('app')
      .controller('financeCtrl', financeCtrl);

    function financeCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, dialogs, commonSvc, $stateParams) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;
        vm.ActiveTab = ActiveTab;
        vm.siteUrl = Config.imagePath;
        vm.isSinglePharmacy = currentUser.isSinglePharmacy;
        vm.GetPharmacyFinanceData = GetPharmacyFinanceData;
        vm.UpdateJobStatusByPharmacy = UpdateJobStatusByPharmacy;
        vm.GenerateInvoice = GenerateInvoice;
        vm.GetMessageForLocum = GetMessageForLocum;
        vm.openMessageBox = openMessageBox;
        vm.sendMessage = sendMessage;
        vm.GetInvoiceFromSL = GetInvoiceFromSL;
        vm.GenerateInvoiceDetailsPDF = GenerateInvoiceDetailsPDF;
        vm.GetBranchForDrobdown = GetBranchForDrobdown;
        vm.SearchJob = SearchJob;
        vm.branchId = null;
        vm.init = init;
        vm.chat = {};
        $scope.chatData = {};
        vm.months = [];
        vm.years = [];
        reSet();

        function init() {
            getYears();
            getMonths();
            vm.GetPharmacyFinanceData();
            vm.GetBranchForDrobdown();
        }

        function reSet() {
            vm.active = $stateParams.tab;

            vm.jobReqModel = {
                locumId: null,
                branchId: null,
                status: 0,
                month: null,
                year: null,
                PageNumber: 1,
                Searchword: null

            }

        }

        function getMonths() {
            vm.months = commonSvc.getMonths();
            vm.selectedMonth = vm.months[0];
        }


        function getYears() {
            vm.years = commonSvc.getYears();
            vm.selectedYear = vm.years[0];
        }

        function ActiveTab(typ) {
            vm.active = typ;
            if (typ == 8) {
                GetInvoiceFromSL();
            } else {
                GetPharmacyFinanceData();
                GetMessageForLocum();
            }
        }

        //--------SearchJob-----------
        function SearchJob() {
            vm.jobReqModel.month = vm.selectedMonth.key;
            vm.jobReqModel.year = vm.selectedYear.key;
            vm.jobReqModel.branchId = vm.branchId;
            GetPharmacyFinanceData();
        }

        //--------GetUserFinaceJobsData-----------
        function GetPharmacyFinanceData() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                vm.jobReqModel.pharmacyId = currentUser.userId;
                vm.jobReqModel.status = vm.active;

                aPIInterFace.doServiceCall('Post', 'GetPharmacyFinanceData', vm.jobReqModel).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.jobList = response.Result;
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

        //--------UpdateStatus-----------
        function UpdateJobStatusByPharmacy(d, status) {
            var dlg = dialogs.confirm('Confirmation', ' Are you sure, you want to update status for this job?');
            dlg.result.then(function (btn) {
                LoaderStart();
                var obj = {
                    jobId: d.jobId,
                    status: status
                }
                aPIInterFace.doServiceCall('Post', 'UpdateJobStatusByPharmacy', obj).then(function (response) {
                    if (response.Success) {
                        GetPharmacyFinanceData();
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

        //-------GenerateInvoice------------
        function GenerateInvoice(d) {
            window.location = Config.invoicePdf + '?gId=' + d.jobId + '&uId=' + d.locumId;
        }

        //-------GenerateInvoice------------
        function GenerateInvoiceDetailsPDF(d) {
            window.location = Config.GenerateInvoiceDetailsPDF + '?pId=' + d.invoiceId;
        }

        //--------SendMessage-----------
        function sendMessage(message) {

            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                vm.chat = {
                    jobId: $scope.chatData.jobId,
                    locumId: 0,
                    pharmacyId: currentUser.userId,
                    message: message,
                    type: currentUser.userType
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
            console.log($scope.chatData)
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

        //--------GetInvoiceFromSL-----------
        function GetInvoiceFromSL() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                var obj = {
                    userId: currentUser.userId
                }

                aPIInterFace.doServiceCall('Post', 'GetInvoiceFromSL', obj).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.invoiceList = response.Result;
                        LoaderStop();
                    }
                    else {
                        alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });
            }
            else {
                alertService.add('danger', 'Invalid User');
            }
        }

        //--------GetBranchList-----------
        function GetBranchForDrobdown() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "4" && !currentUser.isSinglePharmacy) {
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
    }

})();
