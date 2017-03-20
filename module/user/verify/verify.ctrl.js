(function () {
    'use strict';
    angular.module('app')
      .controller('verifyCtrl', verifyCtrl);

    function verifyCtrl($scope, $http, $state, $location, UserSrv, $modal, aPIInterFace, $q) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;

        vm.GetLocumProfile = GetLocumProfile;
        vm.UpdateLocumProfile = UpdateLocumProfile;
        reSet();
        vm.UpdateEssentialDocuments = UpdateEssentialDocuments;
        
        $scope.visaChecked = false;

        $scope.checkVisa = function(){
            $scope.visaChecked = true;
        }

        $scope.uncheckVisa = function(){
            $scope.visaChecked = false;
        }
        
        vm.DocDecModel.checkbox = false;

        $scope.disableButton= function(val){
           if(val==true){
               vm.DocDecModel.checkbox = true;
           }
           else{
               vm.DocDecModel.checkbox =false;
           }
        }

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
                isNHSSmartCard: null
            }

            vm.active = 1;
            GetLocumProfile();

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
                            Gendor: locum.Gendor,
                            Dob: (new Date(locum.Dob)),
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
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            }
            else {
                alert('Invalid User')
                LoaderStop();
            }
        }

        //--------UpdateLocumProfile--------------
        function UpdateLocumProfile() {
            if (vm.myDataForm.$valid) {
                LoaderStart();
                var data = new FormData();
                var img = $("#profilePic").get(0).files;
                $scope.errorMessage = '';
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
                            alert(response.Message);
                            LoaderStop();
                        } else {
                            alert(response.Message);
                            LoaderStop();
                        }

                    },
                    error: function (response) {
                        alert(response.Message);
                        LoaderStop();
                    }
                });

            } else {
                $scope.myDataForm.submitted = true;
                LoaderStop();
            }

        }

       $scope.disableButton= function(val){
        //console.log(val);
            if(val==true){
                vm.DocDecModel.checkbox = true;
            }
            else{
                vm.DocDecModel.checkbox =false;
            }
        }

        //--------UpdateLocumProfile--------------
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
                        //alert(response.Message);
                        $scope.GetDocumentsAndDeclarations();
                        $state.go('user.dashboard');
                    }

                },
                error: function (response) {
                    alert(response.Message);
                }
            });
        }
    }
})();
