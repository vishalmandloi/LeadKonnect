(function () {
    'use strict';
    angular.module('app')
      .controller('innerLocumLayoutCtrl', innerLocumLayoutCtrl);

    function innerLocumLayoutCtrl($scope, $state, $location, AuthSrv, aPIInterFace, StorageUtils, UserSrv, $rootScope) {
        
        $scope.currentState = $state.current.name == 'user.dashboard' ? 1 : 0;

        $scope.profileState = $state.current.name == 'user.profile' ? 1 : 0;

        $rootScope.$on('$stateChangeStart', function(e, toState, currentState) {
            $scope.profileState = toState.name == 'user.profile' ? 1 : 0;
        });
        
        var vm = {};
        $scope.vm = vm;

        $scope.clickStatus = false;

        $scope.openMenu = function(){
          $scope.clickStatus = true;
        };

        $scope.closeMenu = function(){
          $scope.clickStatus = false;
        };

        vm.logout = logout;
        function logout() {
            AuthSrv.logout().then(function () {
                UserSrv.delete();
                $state.go('user1.home');
                LoaderStop();
            });
        };

        $scope.tab = 1;
        
        $scope.setTab = function(newTab){
          $scope.tab = newTab;
          $scope.clickStatus = false;
        };

        $scope.isSet = function(tabNum){
          return $scope.tab === tabNum;
        };

        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        
        reSet();
        //--------GetDocumentsAndDeclarations-----------
        $scope.GetDocumentsAndDeclarations = function() {
            debugger;
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
                            ID_DL_Passport: doc.ID_DL_Passport,
                            indemnityInsurance: doc.indemnityInsurance,
                            DBSCheck: doc.DBSCheck,
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
                       // alert(response.Message)
                        LoaderStop();
                    }
                });
            }
            else {
                ///alert('Invalid User')
                LoaderStop();
            }
        }

        $scope.GetDocumentsAndDeclarations();

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

    };

})();
