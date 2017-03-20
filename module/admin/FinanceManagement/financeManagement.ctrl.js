(function () {
    'use strict';
    angular.module('app')
      .controller('financeManagementCtrl', financeManagementCtrl);

    function financeManagementCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, dialogs) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;
        vm.onChangeFilterBy = onChangeFilterBy;
        vm.GetPharmacyByHeadOffice = GetPharmacyByHeadOffice;
        vm.GetMonthlyInvoiceForAdmin = GetMonthlyInvoiceForAdmin;
        vm.SendInvoiceBySL = SendInvoiceBySL;
        vm.GenerateInvoiceDetailsByAdmin = GenerateInvoiceDetailsByAdmin;
        vm.selectedFilter = null;
        vm.headOfficeId = null;
        vm.pharmacyId = null;

        //--------onChangeFilterBy-------
        function onChangeFilterBy() {
            vm.headOfficeId = null;
            vm.pharmacyId = null;
            if (vm.selectedFilter == 1) {
                GetHeadOfficeForDropdown();
            }

            if (vm.selectedFilter == 2) {
                GetPharmacyByHeadOffice();
            }

            //switch (vm.selectedFilter) {
            //    case 1:
            //        alert(vm.selectedFilter)
            //        GetHeadOfficeForDropdown();
            //        break;
            //    case 2:
            //        GetPharmacyByHeadOffice();
            //        break;
            //    default:
            //        break;
            //}
        }

        //----GetHeadOfficeForDropdown---------
        function GetHeadOfficeForDropdown() {
            LoaderStart();
            aPIInterFace.doServiceCall('Post', 'GetHeadOfficeForDropdown', null, 'admin').then(function (response) {
                console.log(response);
                if (response.Success) {
                    vm.headOfficeList = response.Result;
                    LoaderStop();
                }
                else {
                    alertService.add('danger', response.Message);
                    LoaderStop();
                }
            });
        }

        //----GetHeadOfficeForDropdown---------
        function GetPharmacyByHeadOffice() {
            var obj = {
                userId: vm.headOfficeId
            }
            LoaderStart();
            aPIInterFace.doServiceCall('Post', 'GetPharmacyByHeadOffice', obj, 'admin').then(function (response) {
                console.log(response);
                if (response.Success) {
                    vm.pharmacyList = response.Result;
                    LoaderStop();
                }
                else {
                    alertService.add('danger', response.Message);
                    LoaderStop();
                }
            });
        }

        //----GetMonthlyInvoiceForAdmin---------
        function GetMonthlyInvoiceForAdmin() {
            if ((vm.headOfficeId != null && vm.headOfficeId != '') || (vm.pharmacyId != null && vm.pharmacyId != '')) {
                var obj = {
                    headOfficeId: vm.headOfficeId,
                    pharmacyId: vm.pharmacyId
                }
                LoaderStart();
                aPIInterFace.doServiceCall('Post', 'GetMonthlyInvoiceForAdmin', obj, 'admin').then(function (response) {
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
            } else {
                alertService.add('danger', "Please select either Head office or Pharmacy");
            }
        }

        //----SendInvoiceBySL---------
        function SendInvoiceBySL(d) {
            if ((vm.headOfficeId != null && vm.headOfficeId != '') || (vm.pharmacyId != null && vm.pharmacyId != '')) {
                var obj = {
                    headOfficeId: vm.headOfficeId,
                    pharmacyId: d.pharmacyId,
                    invoceMonth: d.invoceMonth,
                    totalCharge: d.totalCharge,
                    noOfJobs: d.noOfJobs
                }
                LoaderStart();
                aPIInterFace.doServiceCall('Post', 'SendInvoiceBySL', obj, 'admin').then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        GetMonthlyInvoiceForAdmin();
                        LoaderStop();
                    }
                    else {
                        alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });
            } else {
                alertService.add('danger', "Please select either Head office or Pharmacy");
            }
        }

        //-------GenerateInvoiceDetailsByAdmin------------
        function GenerateInvoiceDetailsByAdmin(d) {
            window.location = Config.GenerateInvoiceDetailsByAdmin + '?pId=' + d.pharmacyId + '&date=' + d.invoceMonth;
        }

    }


})();
