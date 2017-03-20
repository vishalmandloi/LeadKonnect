(function () {
    'use strict';
    angular.module('app')
      .controller('locumSettingsCtrl', locumSettingsCtrl);

    function locumSettingsCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, alertService) {

        var currentUser = JSON.parse(localStorage.getItem('app-user'));

        var vm = {};
        $scope.vm = vm;
        vm.GetLocumSettings = GetLocumSettings;
        vm.UpdateLocumSettings = UpdateLocumSettings;
        vm.UpdateLocumPassword = UpdateLocumPassword;
        vm.expandSEcondaryLocation = expandSEcondaryLocation

        vm.settingModel = {
            locumId: null,
            locationPreference: null,
            latitude: null,
            longitude: null,
            distanceTravalForWork: null,
            postalCode: null,
            isDailyAvailableJobs: false,
            isWeeklyNewsletter: false,
            isEmergencyShift: false,
            isWhenJobApproves: false,
            isReminderAfterConfirmedShiftOrCompletedShift: false,
            isPaymentCompleted: false,
            isEndOfTheMonthInvoice: false
        }

        vm.changePwdModel = {
            userId: null,
            oldPassword: null,
            newPassword: null
        }

        vm.confirmPassword = null;

        GetLocumSettings();

        function GetLocumSettings() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                var objReq = {
                    locumId: currentUser.userId
                    // locumId: '1'
                }

                aPIInterFace.doServiceCall('Post', 'GetLocumSettings', objReq).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        var locumsett = response.Result;

                        vm.settingModel = {
                            locumId: locumsett.locumId,
                            locationPreference: locumsett.locationPreference,
                            latitude: locumsett.latitude,
                            longitude: locumsett.longitude,
                            distanceTravalForWork: locumsett.distanceTravalForWork,
                            postalCode: locumsett.postalCode,
                            isDailyAvailableJobs: locumsett.isDailyAvailableJobs,
                            isWeeklyNewsletter: locumsett.isWeeklyNewsletter,
                            isEmergencyShift: locumsett.isEmergencyShift,
                            isWhenJobApproves: locumsett.isWhenJobApproves,
                            isReminderAfterConfirmedShiftOrCompletedShift: locumsett.isReminderAfterConfirmedShiftOrCompletedShift,
                            isPaymentCompleted: locumsett.isPaymentCompleted,
                            isEndOfTheMonthInvoice: locumsett.isEndOfTheMonthInvoice
                        }
                        LoaderStop();
                    }

                    if (response.Result) {
                        var addresses = response.Result;
                        //vm.locumLength = addresses.length;
                        debugger;
                        $(document).ready(function () {
                            debugger;
                            var map;
                            var elevator;
                            var myOptions = {
                                zoom: 5,                                
                                center: new google.maps.LatLng(addresses.primaryLatitude, addresses.primaryLongitude),                                
                                mapTypeId: 'terrain'
                            };
                            map = new google.maps.Map($('#map-userLatLong')[0], myOptions);
                            angular.forEach(addresses,function(p){
                                var latlng = new google.maps.LatLng(addresses.primaryLatitude, addresses.primaryLongitude);
                                new google.maps.Marker({
                                    position: latlng,
                                    map: map
                                });
                            });
                            var circle = new google.maps.Circle({
                                map           : map,
                                center        : myOptions.center,
                                radius        : Number(response.Result.locationPreference * '1609.34'),
                                //editable: true,
                                strokeColor   : '#FF0099',
                                strokeOpacity : 1,
                                strokeWeight  : 2,
                                fillColor     : '#009ee0',
                                fillOpacity   : 0.2
                                });
                        });
                    }                       
                    else {
                        alertService.add('success', response.Message);
                        LoaderStop();
                    }                 
                });
            }
            else {
                alertService.add('danger', response.Message);
                LoaderStop();
            }
        }

        function UpdateLocumSettings() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "2" && vm.settingModel.locationPreference!="") {
                LoaderStart();

                vm.settingModel.locumId = currentUser.userId;

                aPIInterFace.doServiceCall('Post', 'UpdateLocumSettings', vm.settingModel).then(function (response) {
                    console.log(response);
                    GetLocumSettings();
                    if (response.Success) {
                        alertService.add('success', response.Message);
                        LoaderStop();
                    }
                    else {
                        alertService.add('success', response.Message);
                        LoaderStop();
                    }
                });
            }
            else {
                alertService.add('danger', "Invalid request");
                LoaderStop();
            }

        }

        function UpdateLocumPassword() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "2") {
                if (vm.myDataForm.$valid) {
                    LoaderStart();
                    vm.changePwdModel.userId = currentUser.userId;

                    if (vm.changePwdModel.newPassword != vm.confirmPassword) {

                        alertService.add('danger', 'Confirm password does not match!');
                        LoaderStop();
                        return false;
                    }

                    aPIInterFace.doServiceCall('Post', 'UpdateLocumPassword', vm.changePwdModel).then(function (response) {
                        console.log(response);
                        if (response.Success) {
                            vm.changePwdModel = {
                                userId: null,
                                oldPassword: null,
                                newPassword: null
                            }
                            vm.confirmPassword = null;

                            alertService.add('success', response.Message);
                            LoaderStop();
                        }
                        else {
                            alertService.add('danger', response.Message);
                            LoaderStop();
                        }
                    });
                } else {
                    vm.myDataForm = true;
                    LoaderStop();
                }
            }
            else {
                alertService.add('danger', response.Message);
                LoaderStop();
            }

        }

        function expandSEcondaryLocation(data){
            if(data == 'true'){
                $scope.secondaryLocation = 'false';
            }
            else{
            $scope.secondaryLocation = 'true';
            }
        }
    }
})();
