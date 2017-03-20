(function () {
    'use strict';
    angular.module('app')
      .controller('jobsCtrl', jobsCtrl);

    function jobsCtrl($scope, $http, UserSrv, dialogs, aPIInterFace, $q, $location, commonSvc,$stateParams,alertService,StorageUtils) {

        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        console.log(currentUser);
        var vm = {};
        $scope.vm = vm;
        vm.isMultiLocation = currentUser.isMultiLocation;
        vm.pharmacyName = currentUser.userName;
        vm.isActive = currentUser.isActive;
        vm.GetLocumJobByStatus = GetLocumJobByStatus;
        vm.GetMessageForLocum = GetMessageForLocum;
        vm.AppliedJob = AppliedJob;
        vm.ActiveTab = ActiveTab;
        vm.openMessageBox = openMessageBox;
        vm.sendMessage = sendMessage;
        vm.chat = {};
        $scope.chatData = {};
        vm.months = [];
        vm.years = [];
        vm.SearchJob = SearchJob;
        vm.init = init;
        vm.ReSendOtpFunc=ReSendOtpFunc;

        vm.otpNumber='';

        vm.SendOTP=SendOTP;

        vm.VerifiedOtp=VerifiedOtp;

        reSet();

        function init() {
            getYears();
            getMonths();
            vm.GetLocumJobByStatus();
        }

        function getMonths() {
            vm.months = commonSvc.getMonths();
            vm.selectedMonth = vm.months[0];
        }


        function getYears() {
            vm.years = commonSvc.getYears();
            vm.selectedYear = vm.years[0];
        }

        function reSet() {
            vm.active = $stateParams.tab;
            vm.jobReqModel = {
                locumId: null,
                status: 0,
                filterType: null,
                date: null,
                PageNumber: 1,
                Searchword: null,
                month: null,
                year: null,
                locationTyp: ''
            }
            vm.ReqMobileVerify = {
                locumId:currentUser.userId,
                mobileNumber: currentUser.mobileNumber,
                newMobileNumber: ''
            }
        }

        //--------SearchJob-----------
        function SearchJob() {
            vm.jobReqModel.month = vm.selectedMonth.key;
            vm.jobReqModel.year = vm.selectedYear.key;
            GetLocumJobByStatus();
        }

        vm.ConvertDate = function (d) {
            return new Date(d);
        }

        function ActiveTab(typ) {
            var searchObject = $location.search();
            if (searchObject.tab) {
                typ = searchObject.tab;
                $location.url($location.path());
            }

            vm.active = typ;
            vm.jobReqModel.date = null;
            vm.jobReqModel.status = typ;
            GetLocumJobByStatus();
            // GetMessageForLocum();
        }


        //--------GetLocumJobByStatus-----------
        function GetLocumJobByStatus() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                vm.jobReqModel.locumId = currentUser.userId;
                vm.jobReqModel.status = vm.active;

                aPIInterFace.doServiceCall('Post', 'GetLocumJobByStatus', vm.jobReqModel).then(function (response) {
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
                alertService.add('danger', 'Invalid User');
            }
        }

        function AppliedJob(job) {

            if(currentUser.isMobileVerify)
            {
                    if (vm.isActive) {

                        var msg = (job.jobDescription) ? 'More : ' + job.jobDescription + ' <br/> <hr/>' : '';
                        msg = msg + 'Are you sure, you want to apply for this job?';

                        var dlg = dialogs.confirm('Confirmation', msg);

                        dlg.result.then(function (btn) {
                            var obj = {
                                locumId: currentUser.userId,
                                jobId: job.jobId
                            };

                            aPIInterFace.doServiceCall('Post', 'AppliedJob', obj).then(function (response) {
                                console.log(response);
                                if (response.Success) {
                                    GetLocumJobByStatus();
                                }
                                else {
                                    alert(response.Message)
                                }
                            });
                        }, function (btn) {

                        });
                    } else {
                        alert('Sorry, Your documents are being reviewed by the SmartLocum team please come back later.');
                    }
            }
            else
            {
               $('#lnkMobileVerify').click();
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

        //--------SendMessage-----------
        function sendMessage(message) {

            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "2") {
                LoaderStart();
                vm.chat = {
                    jobId: $scope.chatData.jobId,
                    locumId: currentUser.userId,
                    pharmacyId: 0,
                    message: message,
                    type: currentUser.userType
                }

                vm.messageResult.push({ message: message, locumName: currentUser.userName, pharmacyId: 0, userType: currentUser.userType });

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

        //--------GetMessage-----------
        function GetMessageForLocum() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "2") {
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



        function SendOTP() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                aPIInterFace.doServiceCall('Post', 'SendOtp', vm.ReqMobileVerify).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        //vm.jobList = response.Result;
                        $('#lnkOTPVerify').click();
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


        function VerifiedOtp() {
            if ( vm.otpNumber!='') {
                LoaderStart();

                var objReq={
                    locumId:currentUser.userId,
                    otp:vm.otpNumber
                }

                aPIInterFace.doServiceCall('Post', 'VerifiedOtpPost', objReq).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        //vm.jobList = response.Result;
                        $('#lnkOTPVerify').click();
                       // $('#lnkMobileVerify').click();
                        currentUser.isMobileVerify=true;
                        alertService.add('success', response.Message);

                        StorageUtils.set('user', currentUser);

                        LoaderStop();
                    }
                    else {
                        alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });
            }
            else {
                //alertService.add('danger', 'Invalid User');
            }
        }

        function ReSendOtpFunc() {
                LoaderStart();
                aPIInterFace.doServiceCall('Post', 'ReSendOtp', {userId:currentUser.userId}).then(function (response) {
                    if (response.Success) {
                        alertService.add('success', response.Message);
                        LoaderStop();
                    }
                    else {
                        alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });

        }

    }
})();
