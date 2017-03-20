(function () {
    'use strict';
    angular.module('app')
      .controller('profileCtrl', profileCtrl);

    function profileCtrl($scope, $http, UserSrv, $state, $location, $modal, aPIInterFace, $q, alertService) {
        //var currentUser = UserSrv.get();

        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;
        $('#profilePicSpan').show();
        vm.ActiveTab = ActiveTab;
        vm.GetLocumProfile = GetLocumProfile;
        vm.UpdateLocumProfile = UpdateLocumProfile;
        reSet();
        vm.UpdateEssentialDocuments = UpdateEssentialDocuments;
        vm.AddUpdateBankDetails = AddUpdateBankDetails;
        vm.GetLocumBankDetails = GetLocumBankDetails;
        vm.ukPostCodeRegex = /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;
        GetDocumentsAndDeclarations();

        $scope.visaChecked = false;

        $scope.checkVisa = function () {
            $scope.visaChecked = true;
        }

        $scope.uncheckVisa = function () {
            $scope.visaChecked = false;
        }

        //console.log(vm.DocDecModel.checkBox);
        // $scope.disableButton= function(val){
        //     if(val==true){
        //         vm.DocDecModel.checkBox = true;
        //     }else{
        //         vm.DocDecModel.checkBox =false;
        //     }
        // }

        function reSet() {
            vm.profileModel = {
                locumId: currentUser.userId,
                FirstName: null,
                LastName: null,
                EmailId: null,
                Password: null,
                GPHCNumber: null,
                PostalCode: null,
                UserAddress: null,
                address2: null,
                city: null,
                Gendor: null,
                Dob: null,
                MobileNumber: null,
                profileImage: null,
                levelOfExp: {
                    analyst: null,
                    compass: null,
                    proScriptLink: null,
                    proScript: null,
                    positiveSolution: null,
                    pharmacyManager: null,
                    nextPhase: null
                }
            }

            vm.DocDecModel = {
                locumId: currentUser.userId,
                ID_DL_Passport: null,
                indemnityInsurance: null,
                DBSCheck: null,
                workVisaPermit: null,
                isLegalRightToWork: null,
                isRefusedFitnessPurchase: null,
                isVATRegistered: null,
                isMURS: null,
                isNMS: null,
                isProvideFLUVaccine: null,
                isRepeatDispensing: null,
                isSafeGuardingChild_Adults: null,
                isNHSSmartCard: null,
                isBoxChecked: false
            }

            vm.bankModel = {
                locumId: currentUser.userId,
                accountHolderName: null,
                bankAccountNumber: null,
                bankName: null,
                bankSortCode: null,
                NINumber: null
            }

            vm.active = 1;
            GetLocumProfile();

        }

        function ActiveTab(typ) {
            vm.active = typ;
            vm.myDataForm.$setPristine();
            if (typ == 1) {
                $('#profilePicSpan').show();
                GetLocumProfile();
                $('#available-job').show();
                $('#doc-dec').hide();
                $('#finances').hide();
            } else if (typ == 2) {
                $('#profilePicSpan').hide();
                $('#available-job').hide();
                $('#doc-dec').show();
                $('#finances').hide();
            } else {
                $('#profilePicSpan').hide();
                $('#available-job').hide();
                $('#doc-dec').hide();
                $('#finances').show();
                GetLocumBankDetails();
            }
        }

        //--------GetLocumProfile-----------
        function GetLocumProfile() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "2") {
                LoaderStart();
                var objReq = {
                    locumId: currentUser.userId
                    // locumId: '1'
                }

                aPIInterFace.doServiceCall('Post', 'GetLocumProfile', objReq).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        var locum = response.Result;

                        vm.profileModel = {
                            FirstName: locum.FirstName,
                            LastName: locum.LastName,
                            EmailId: locum.EmailId,
                            Password: locum.Password,
                            GPHCNumber: locum.GPHCNumber,
                            PostalCode: locum.PostalCode,
                            UserAddress: locum.UserAddress,
                            address2: locum.address2,
                            city: locum.city,
                            Gendor: locum.Gendor,
                            Dob: locum.Dob,
                            MobileNumber: locum.MobileNumber,
                            profileImage: locum.profileImage,
                            levelOfExp: {
                                analyst: locum.levelOfExp.analyst,
                                compass: locum.levelOfExp.compass,
                                proScriptLink: locum.levelOfExp.proScriptLink,
                                proScript: locum.levelOfExp.proScript.proScript,
                                positiveSolution: locum.levelOfExp.positiveSolution,
                                pharmacyManager: locum.levelOfExp.pharmacyManager,
                                nextPhase: locum.levelOfExp.nextPhase
                            }
                        }
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
                LoaderStop();
            }
        }
         vm.imagePath = 'http://52.38.226.23/samrtlocumapi/WebImages/';
        //--------GetDocumentsAndDeclarations-----------
        function GetDocumentsAndDeclarations() {
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "2") {
                LoaderStart();
                var objReq = {
                    userId: currentUser.userId
                    // userId: '1'
                }
                console.log(objReq);

                aPIInterFace.doServiceCall('Post', 'GetDocumentsAndDeclarations', objReq).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        var doc = response.Result;

                        vm.DocDecModel = {
                            locumId: currentUser.userId,
                            ID_DL_Passport:doc.ID_DL_Passport,
                            indemnityInsurance:doc.indemnityInsurance,
                            DBSCheck:doc.DBSCheck,
                            workVisaPermit: doc.workVisaPermit,
                            isLegalRightToWork: doc.isLegalRightToWork,
                            isRefusedFitnessPurchase: doc.isRefusedFitnessPurchase,
                            isVATRegistered: doc.isVATRegistered,
                            isMURS: doc.isMURS,
                            isNMS: doc.isNMS,
                            isProvideFLUVaccine: doc.isProvideFLUVaccine,
                            isRepeatDispensing: doc.isRepeatDispensing,
                            isSafeGuardingChild_Adults: doc.isSafeGuardingChild_Adults,
                            isNHSSmartCard: doc.isNHSSmartCard
                        }
                        LoaderStop();
                    }
                    else {
                        // alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });
            }
            else {
                alertService.add('danger', 'Invalid User');
                LoaderStop();
            }
        }

        //--------UpdateLocumProfile--------------
        function UpdateLocumProfile() {
            console.log(vm.myDataForm)
            if (vm.myDataForm.$valid) {
                LoaderStart();
                var data = new FormData();
                var img = $("#profilePic").get(0).files;
                var daGroupModelta = new FormData();
                if (img.length > 0) {
                    for (var i = 0; i < img.length; i++) {

                        data.append("image" + (i + 1), img[i]);
                    }
                }
                vm.profileModel.locumId = currentUser.userId;
                var jsonString = JSON.stringify(vm.profileModel);
                data.append("json", jsonString);

                $.ajax({
                    type: "POST",
                    url: Config.backendUrl + "UpdateLocumProfile",
                    contentType: false,
                    processData: false,
                    async: true,
                    data: data,
                    success: function (response) {
                        console.log(response);
                        if (response.Success) {
                            alertService.add('success', response.Message);
                            LoaderStop();
                        } else {
                            alertService.add('success', response.Message);
                            LoaderStop();
                        }
                        $scope.$apply();
                    },
                    error: function (response) {
                        alertService.add('danger', response.Message);

                        LoaderStop();

                    }
                });

            } else {
                vm.myDataForm.submitted = true;
                LoaderStop();
            }

        }

        //--------UpdateEssentialDocuments--------------
        function UpdateEssentialDocuments() {
            var data = new FormData();

            var fileIDDrivingLicense = $("#fileIDDrivingLicense").get(0).files;
            var fileIndemnityInsurance = $("#fileIndemnityInsurance").get(0).files;
            var fileDBSCheck = $("#fileDBSCheck").get(0).files;
            var fileWorkPermit = $("#fileWorkPermit").get(0).files;

            if (fileIDDrivingLicense.length > 0) {
                for (var i = 0; i < fileIDDrivingLicense.length; i++) {
                    data.append("fileIDDrivingLicense" + (i + 1), fileIDDrivingLicense[i]);
                }
            }

            if (fileIndemnityInsurance.length > 0) {
                for (var i = 0; i < fileIndemnityInsurance.length; i++) {
                    data.append("fileIndemnityInsurance" + (i + 1), fileIndemnityInsurance[i]);
                }
            }

            if (fileDBSCheck.length > 0) {
                for (var i = 0; i < fileDBSCheck.length; i++) {
                    data.append("fileDBSCheck" + (i + 1), fileDBSCheck[i]);
                }
            }

            if (fileWorkPermit.length > 0) {
                for (var i = 0; i < fileWorkPermit.length; i++) {
                    data.append("fileWorkPermit" + (i + 1), fileWorkPermit[i]);
                }
            }
            vm.profileModel.locumId = currentUser.userId;
            var jsonString = JSON.stringify(vm.DocDecModel);
            data.append("json", jsonString);

            $.ajax({
                type: "POST",
                url: Config.backendUrl + "UpdateEssentialDocuments",
                contentType: false,
                processData: false,
                async: true,
                data: data,
                success: function (response) {
                    console.log(response);
                    if (response.Success) {
                        alertService.add('success', response.Message);
                        GetDocumentsAndDeclarations();

                    } else {
                        alertService.add('danger', response.Message);
                    }
                    $scope.$apply();
                },
                error: function (response) {
                    alertService.add('danger', response.Message);

                }
            });
        }

        //--------AddUpdateBankDetails--------------
        function AddUpdateBankDetails() {
            vm.bankFormData.submitted = false;
            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "2") {

                if (vm.bankFormData.$valid) {
                    LoaderStart();
                    aPIInterFace.doServiceCall('Post', 'AddUpdateBankDetails', vm.bankModel).then(function (response) {
                        console.log(response);
                        if (response.Success) {
                            alertService.add('success', response.Message);

                            LoaderStop();
                        }
                        else {
                            alertService.add('danger', response.Message);
                            LoaderStop();
                        }
                    });
                } else {
                    vm.bankFormData.submitted = true;
                }
            }
            else {
                alertService.add('danger', 'Invalid User');
                LoaderStop();
            }
        }

        //--------GetDocumentsAndDeclarations-----------
        function GetLocumBankDetails() {

            if (currentUser.userId != undefined && currentUser.userId != null && currentUser.userType == "2") {
                LoaderStart();
                var objReq = {
                    userId: currentUser.userId
                    // userId: '1'
                }
                console.log(objReq);

                aPIInterFace.doServiceCall('Post', 'GetLocumBankDetails', objReq).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        var bank = response.Result;

                        vm.bankModel = {
                            locumId: currentUser.userId,
                            accountHolderName: bank.accountHolderName,
                            bankAccountNumber: bank.bankAccountNumber,
                            bankName: bank.bankName,
                            bankSortCode: bank.bankSortCode,
                            NINumber: bank.NINumber
                        }
                        LoaderStop();
                    }
                    else {
                        //alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });
            }
            else {
                alertService.add('danger', 'Invalid User');
                LoaderStop();
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

        $scope.formats = ['fullDate', 'EEEE, dd MMM yyyy'];
        $scope.format = $scope.formats[1];
    }
})();
