(function () {
    'use strict';
    angular.module('app')
      .controller('pharmacyProfileCtrl', pharmacyProfileCtrl);

    function pharmacyProfileCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $filter, alertService, $stateParams) {

        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        console.log(currentUser);

        var vm = {};
        $scope.vm = vm;
        vm.days = [{ name: "Monday" }, { name: "Tuesday" }, { name: "Wednesday" }, { name: "Thursday" }, { name: "Friday" }, { name: "Saturday" }, { name: "Sunday" }];
        vm.GetITSystemForDropdown = GetITSystemForDropdown;
        vm.GetPharmacyProfile = GetPharmacyProfile;
        vm.timingList = [];
        vm.GetBranchList = GetBranchList;


        //--------GetITSystemForDropdown-----------
        function GetITSystemForDropdown() {

            aPIInterFace.doServiceCall('Post', 'GetITSystemForDropdown').then(function (response) {
                console.log(response);
                if (response.Success) {
                    vm.ItSystemList = response.Result;
                    LoaderStop();
                }
                else {
                    alert(response.Message)
                    LoaderStop();
                }
            });


        }


        //--------GetPharmacyProfile-----------
        function GetPharmacyProfile() {
            LoaderStart();
            var objReq = {
                userId: $stateParams.id
            }

            aPIInterFace.doServiceCall('Post', 'GetPharmacyProfile', objReq).then(function (response) {
                console.log(response);
                if (response.Success) {
                    var phar = response.Result;
                    console.log(phar);
                    vm.profileModel = {
                        pharmacyId: phar.pharmacyId,
                        ODSCode: phar.ODSCode,
                        pharmacyName: phar.pharmacyName,
                        firstName: phar.firstName,
                        lastName: phar.lastName,
                        emailId: phar.emailId,
                        mobileNumber: phar.mobileNumber,
                        ITSystemId: phar.ITSystemId,
                        breakTime: phar.breakTime,
                        isBreakTimePaid: phar.isBreakTimePaid,
                        travelExpense: (phar.travelExpense != 0) ? phar.travelExpense : '3',
                        travelExpensePerMile: phar.travelExpensePerMile,
                        profileImage: phar.profileImage,
                        emergencyShift: phar.emergencyShift,
                        normalShift: phar.normalShift,
                        address1: phar.address1,
                        address2: phar.address2,
                        city: phar.city,
                        postalCode: phar.postalCode,
                        isSinglePharmacy:phar.isSinglePharmacy
                    }

                    var dayList = phar.timingSlot;
                    if (dayList.length > 0) {
                        for (var i = 1; i <= 7; i++) {
                            if (dayList.length > 0) {
                                var len = $filter('filter')(dayList, { dayId: i }, true)[0]
                                if (len != null) {
                                    var obj = {
                                        dayId: i,
                                        startTime: len.startTime,
                                        finishTime: len.finishTime,
                                        isOpen: len.isOpen
                                    }
                                    vm.timingList.push(obj);
                                } else {
                                    var obj = {
                                        dayId: i,
                                        startTime: null,
                                        finishTime: null,
                                        isOpen: false
                                    }
                                    vm.timingList.push(obj);
                                }
                            } else {
                                var obj = {
                                    dayId: i,
                                    startTime: null,
                                    finishTime: null,
                                    isOpen: false
                                }
                                vm.timingList.push(obj);
                            }

                        }
                    }
                    console.log(vm.timingList);
                    LoaderStop();
                }
                else {
                    alert(response.Message);
                    LoaderStop();
                }
            });

        }

        //--------GetBranchList-----------
        function GetBranchList() {
            LoaderStart();
            var objReq = {
                userId: $stateParams.id
            }

            aPIInterFace.doServiceCall('Post', 'GetBranchList', objReq).then(function (response) {
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
    }
})();
