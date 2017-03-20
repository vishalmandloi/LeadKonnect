(function () {
    'use strict';
    angular.module('app')
      .controller('MessageCtrl', MessageCtrl);

    function MessageCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $timeout) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;

        vm.GetPharmacyMessageList = GetPharmacyMessageList;
        vm.showJobMessage = showJobMessage;
        vm.sendMessage = sendMessage;
        
        GetPharmacyMessageList();

        vm.pharmacyJobs = {};

        

        $scope.chatData = {};

        $scope.toggleObject = {
            item: 0
        };

        //function GetScrollBottom() {
        //    $timeout(function() {
        //       /*  $scope.updateScrollbar('scrollTo', "#last");
        //         $('#last').scrollTop = 100;*/
        //         //$location.hash('#last');
        //         //$(".mCSB_2_container").scrollTo("#last");
        //         debugger;
        //         var p = $("#last");
        //         var offset = parseInt(p.position().top)-320;
        //         $('#mCSB_2_container').css("top", "-"+offset+"px");
        //         $('#mCSB_2_dragger_vertical').css("top", "334px");
        //    },1000);
        //}
        //GetScrollBottom();
       
        //--------GetMessage-----------
        function GetPharmacyMessageList() {
            console.log(currentUser)
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart(); 

                var data = {
                    query : {
                        pharmacyId: currentUser.userId
                    }
                };

                aPIInterFace.doServiceCall('Get', 'GetPharmacyMessageList', data).then(function (response) {
                    
                    if (response.Success) {
                        console.log(response)
                        vm.jobDetailsPharmacy = response.Result;
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
            return vm.jobDetails;
        }


        //--------GetMessage-----------
        function showJobMessage(jobData) {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                vm.messageData = {
                    jobId: jobData.jobId,
                    locumId: jobData.locumId,
                    PageNumber: 1,
                    Searchword: ''
                }
                $scope.chatData = jobData;
                aPIInterFace.doServiceCall('Post', 'GetMessageForLocum', vm.messageData).then(function (response) {

                    if (response.Success) {
                        console.log(response)
                        vm.messageResult = response.Result;
                        LoaderStop();
                        GetScrollBottom();
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

        //--------SendMessage-----------
        function sendMessage(message) {
            console.log($scope.chatData)
            console.log(currentUser)
            if (currentUser.userId != undefined && currentUser.userId != null ) {
                LoaderStart();
                vm.chat = {
                    jobId: $scope.chatData.jobId,
                    locumId: $scope.chatData.locumId,
                    pharmacyId: currentUser.userId,
                    message: message,
                    type: currentUser.userType
                }

                vm.messageResult.push({message:message,pharmacyName:currentUser.userName,type: currentUser.userType});
             
                aPIInterFace.doServiceCall('Post', 'SaveMessages', vm.chat).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.messageData = response.Result;
                        LoaderStop();
                        GetScrollBottom();
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

    }
})();