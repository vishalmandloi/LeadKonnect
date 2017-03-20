(function () {
    'use strict';
    angular.module('app')
      .controller('multiplePharmacyProfileCtrl', multiplePharmacyProfileCtrl);

    function multiplePharmacyProfileCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $filter, alertService) {

        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        console.log(currentUser);

        var vm = {};
        $scope.vm = vm;
        vm.ukPostCodeRegex = /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;
        vm.ActiveTab = ActiveTab;
        vm.active = 1;
        vm.openBranchPoup = openBranchPoup;

        vm.GetPharmacyProfile = GetPharmacyProfile;
        vm.GetBranchList = GetBranchList;
        vm.UpdatePharmacyProfile = UpdatePharmacyProfile;
        vm.AddUpdatePharmacyBranch = AddUpdatePharmacyBranch;
        vm.GetITSystemForDropdown = GetITSystemForDropdown;
        vm.timingList = [];

        vm.housrList = ["00:00", "00:15", "00:30", "00:45", "01:00", "01:15", "01:30", "01:45",
 "02:00", "02:15", "02:30", "02:45", "03:00", "03:15", "03:30", "03:45", "04:00", "04:15", "04:30", "04:45",
 "05:00", "05:15", "05:30", "05:45", "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00",
 "09:15", "09:30", "09:45",
 "10:00", "10:15", "10:30", "10:45", "11:00", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00",
"14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45",
 "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45",
 "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45"];
        vm.days = [{ name: "Monday" }, { name: "Tuesday" }, { name: "Wednesday" }, { name: "Thursday" }, { name: "Friday" }, { name: "Saturday" }, { name: "Sunday" }];


        reSet();

        function reSet() {
            vm.profileModel = {
                pharmacyId: null,
                pharmacyName: null,
                firstName: null,
                lastName: null,
                emailId: null,
                mobileNumber: null,
                ITSystemId: null,
                breakTime: null,
                isBreakTimePaid: null,
                travelExpense: null,
                travelExpensePerMile: null,
                profileImage: null,
                emergencyShift: null,
                normalShift: null,
                address1: null,
                address2: null,
                city: null,
                postalCode: null,
                telephoneNo:null
            }

            vm.BranchModel = {
                branchId: null,
                pharmacyId: null,
                branchNo: null,
                branchName: null,
                branchAddress: null,
                mobileNumber: null,
                ODSCode: null,
                telNumber: null,
                address2: null,
                city: null,
                postalCode: null,
                timingList: []
            }
        }

        function ActiveTab(typ) {
            vm.active = typ;
            if (typ == 1) {
                $('#pharmacy-info').show();
                $('#account-info').hide();
            } else if (typ == 2) {
                $('#pharmacy-info').show();
                $('#account-info').hide();
            }
        }

        function openBranchPoup(typ, phar) {
            console.log(phar)
            //------------Add new branch------------
            vm.timingList = [];
            if (typ == 1) {
                vm.BranchModel = {
                    branchId: null,
                    pharmacyId: null,
                    branchNo: null,
                    branchName: null,
                    branchAddress: null,
                    mobileNumber: null,
                    ODSCode: null,
                    telNumber: null,
                    address2: null,
                    city: null,
                    postalCode: null,
                    timingList: []
                }

                for (var i = 1; i <= 7; i++) {
                    var obj = {
                        dayId: i,
                        startTime: null,
                        finishTime: null,
                        isOpen: false
                    }
                    vm.timingList.push(obj);
                }

            } else {
                //------------Update branch--------------
                var dayList = phar.timingSlot;

                vm.BranchModel = {
                    branchId: phar.branchId,
                    pharmacyId: phar.pharmacyId,
                    branchNo: phar.branchNo,
                    branchName: phar.branchName,
                    branchAddress: phar.branchAddress,
                    mobileNumber: phar.mobileNumber,
                    ODSCode: phar.ODSCode,
                    telNumber: phar.telNumber,
                    address2: phar.address2,
                    city: phar.city,
                    postalCode: phar.postalCode,
                    timingList: []
                }

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


            $('#branch_poup').modal('show');
        }

        //--------GetPharmacyProfile-----------
        function GetPharmacyProfile() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "4" && !currentUser.isSinglePharmacy) {
                LoaderStart();
                var objReq = {
                    userId: currentUser.userId
                }

                aPIInterFace.doServiceCall('Post', 'GetPharmacyProfile', objReq).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        var phar = response.Result;

                        vm.profileModel = {
                            pharmacyId: phar.pharmacyId,
                            pharmacyName: phar.pharmacyName,
                            firstName: phar.firstName,
                            lastName: phar.lastName,
                            emailId: phar.emailId,
                            mobileNumber: phar.mobileNumber,
                            ITSystemId: phar.ITSystemId,
                            breakTime: phar.breakTime,
                            isBreakTimePaid: phar.isBreakTimePaid,
                            travelExpense: phar.travelExpense,
                            travelExpensePerMile: phar.travelExpensePerMile,
                            profileImage: phar.profileImage,
                            emergencyShift: phar.emergencyShift,
                            normalShift: phar.normalShift,
                            address1: phar.address1,
                            address2: phar.address2,
                            city: phar.city,
                            postalCode: phar.postalCode,
                            telephoneNo:phar.telephoneNo
                        }
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
        function GetBranchList() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "4" && !currentUser.isSinglePharmacy) {
                LoaderStart();
                var objReq = {
                    userId: currentUser.userId
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
            else {
                alert('Invalid User')
            }
        }

        //--------UpdateLocumProfile--------------
        function UpdatePharmacyProfile() {
          /*  if (vm.profileDataForm.$valid) {*/
                LoaderStart();
                var data = new FormData();
                var img = $("#profilePic1").get(0).files;
                var daGroupModelta = new FormData();
                if (img.length > 0) {
                    for (var i = 0; i < img.length; i++) {

                        data.append("image" + (i + 1), img[i]);
                    }
                }
                vm.profileModel.locumId = '1';
                var jsonString = JSON.stringify(vm.profileModel);
                data.append("json", jsonString);

                $.ajax({
                    type: "POST",
                    url: Config.backendUrl + "UpdatePharmacyProfile",
                    contentType: false,
                    processData: false,
                    async: true,
                    data: data,
                    success: function (response) {
                        console.log(response);
                        if (response.Success) {
                            //alert(response.Message);
                            alertService.add('success', response.Message);
                            $scope.$apply();
                            LoaderStop();

                        } else {
                            //alert(response.Message);
                            alertService.add('danger', response.Message);
                            $scope.$apply();
                            LoaderStop();
                        }

                    },
                    error: function (response) {
                        //alert(response.Message);
                        alertService.add('danger', response.Message);
                        $scope.$apply();
                        LoaderStop();
                    }
                });

          /*  } else {
                vm.profileDataForm.submitted = true;
            }*/

        }

        function AddUpdatePharmacyBranch() {
            if (vm.myDataForm.$valid) {
                LoaderStart();
                vm.BranchModel.pharmacyId = currentUser.userId;
                vm.BranchModel.timingSlot = vm.timingList;

                aPIInterFace.doServiceCall('Post', 'AddUpdatePharmacyBranch', vm.BranchModel).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        GetBranchList();
                        $('#branch_poup').modal('hide');
                        LoaderStop();
                        vm.BranchModel = {
                            branchId: null,
                            pharmacyId: null,
                            branchNo: null,
                            branchName: null,
                            branchAddress: null,
                            mobileNumber: null,
                            ODSCode: null,
                            openingHours: null,
                            telNumber: null,
                            address2: null,
                            city: null,
                        }
                    }
                    else {
                        //alert(response.Message)
                        alertService.add('success', response.Message);
                        $scope.$apply();
                        LoaderStop();
                    }
                });
            } else {
                vm.myDataForm.submitted = true;
            }
        }

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

        vm.GetPharmacyDetail = function () {

            if (vm.BranchModel.ODSCode != '') {
                var data = {
                    query: {
                        ODSCode: vm.BranchModel.ODSCode
                    }
                }
                aPIInterFace.doServiceCall('Get', 'GetPharmacyDetailForSignUp', data).then(function (response) {
                    if (response.Result.Name != null) {
                        vm.BranchModel.branchName = response.Result.Name;
                        vm.BranchModel.branchAddress = response.Result.Address;
                        vm.BranchModel.mobileNumber = response.Result.Phone;
                        vm.BranchModel.latitude = response.Result.GeographicCoordinates.Latitude;
                        vm.BranchModel.longitude = response.Result.GeographicCoordinates.Longitude;
                    }
                });
            }

        }

        vm.getODScodes = function (query) {
            return $http.get(Config.backendUrl + 'GetODSNumber', {
                params: {
                    ODSCode: query,
                    take: 10
                }
            }).then(function (response) {
                return response.data.Result;
            });
        };

    }
})();
