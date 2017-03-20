(function () {
    'use strict';
    angular.module('app')
      .controller('settingsCtrl', settingsCtrl);

    function settingsCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;
        vm.SaveAdminSettings = SaveAdminSettings;
        vm.GetAdminSettings = GetAdminSettings;


        vm.settingModel = {
            userId: null,
            emergencyShift: null,
            normalShift: null
        }


        function SaveAdminSettings() {
            
            if (currentUser.userId != undefined && currentUser.userId != null) {
                if (vm.myDataForm.$valid) {
                    vm.settingModel.userId = currentUser.userId;
                    aPIInterFace.doServiceCall('Post', 'SaveAdminSettings', vm.settingModel, 'admin').then(function (response) {
                        console.log(response);
                        if (response.Success) {
                            alert(response.Message)
                        }
                        else {
                            alert(response.Message)
                        }
                    });
                } else {
                    vm.myDataForm = true;
                }
            }
            else {
                alert('Invalid User')
            }

        }

        function GetAdminSettings() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                var obj = {
                    userId: currentUser.userId
                }
                aPIInterFace.doServiceCall('Post', 'GetAdminSettings', obj, 'admin').then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        // alert(response.Message)
                        var sett = response.Result;
                        vm.settingModel = {
                            userId: null,
                            emergencyShift: sett.emergencyShift,
                            normalShift: sett.normalShift
                        }

                    }
                    else {
                        alert(response.Message)
                    }
                });
            }
            else {
                alert('Invalid User')
            }

        }

    }
})();
