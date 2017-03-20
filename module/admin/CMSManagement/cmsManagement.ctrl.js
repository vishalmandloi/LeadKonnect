(function () {
    'use strict';
    angular.module('app')
    .controller('cmsManagementCtrl', cmsManagementCtrl);

    function cmsManagementCtrl($scope, $state, StorageUtils, aPIInterFace, cmsManagementSrv, $rootScope) {
        var vm = {};
        $scope.vm = vm;
        vm.GetContentFoCMS = GetContentFoCMS;
        vm.GetPagesForDropdown = GetPagesForDropdown;
        vm.AddUpdatePageContent = AddUpdatePageContent;
        vm.openModalPoup = openModalPoup;
        vm.role = StorageUtils.getSync('role');
        vm.confirmbox = confirmbox;
        vm.SuccessMsg = null;
        vm.ErrorMsg = null;
        reSet();
        function reSet() {

            vm.contentModel = {
                contentId: null,
                pageId: null,
                pageContent:null
            }
        }


        ///----GetContentFoCMS for Admin
        function GetContentFoCMS() {
            aPIInterFace.doServiceCall('Post', 'GetContentFoCMS', null, 'admin').then(function (response) {
                console.log(response);
                if (response.Success) {
                    vm.contentList = response.Result;
                }
                else {
                    alert(response.Message)
                }
            });
        }

        ///----GetPagesForDropdown for Admin
        function GetPagesForDropdown() {
            debugger;
            aPIInterFace.doServiceCall('Post', 'GetPagesForDropdown', null, 'admin').then(function (response) {
                vm.pageList = response.Result;
                
            });

        }

        function AddUpdatePageContent() {
            if (vm.myDataForm.$valid) {
                LoaderStart();

                cmsManagementSrv.submitCms(vm.contentModel).then(function (response) {
               // aPIInterFace.doServiceCall('Post', 'AddUpdatePageContent', vm.contentModel, 'admin').then(function (response) {
                console.log(response);
                if (response.Success) {
                       // $('#dataModalPoup').modal('hide');
                       GetContentFoCMS();
                       LoaderStop();
                   }
                   else {
                    alert(response.Message)
                    LoaderStop();
                }
            });
            } else {
                vm.myDataForm.submitted = true;
                LoaderStop();
            }
        }

        function confirmbox(action, obj) {
            vm.SuccessMsg = null;
            vm.ErrorMsg = null;
            var r = confirm("Are you sure,you want to " + action + ' this');
            if (r == true) {
                var obj = {
                    page: 'content',
                    colName: action,// == 'Delete' ? 'isDelete' : 'isActive',
                    value: (action == 'Block') ? false : true,//------In Delete and Block case: true else UnBlock Case: false
                    id: obj.contentId
                };

                aPIInterFace.doServiceCall('Post', 'UpdateIsActiveAndIsDelete', obj, 'admin').then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        if (action == "Delete") {
                            vm.SuccessMsg = response.Message;
                            GetContentFoCMS();
                        }
                        else {
                            vm.SuccessMsg = response.Message;
                            obj.isActive = !obj.isActive;
                            GetContentFoCMS();
                        }

                    }
                    else {
                        vm.ErrorMsg = response.Message;
                    }
                });

            }
        }

        function openModalPoup(typ,d) {
            if (typ == 1) { //----Add new entry
                reSet();
            } else {//---Update
                vm.contentModel = {
                    contentId: d.contentId,
                    pageId: d.pageId,
                    pageContent: d.pageContent
                }
            }
            //$('#dataModalPoup').modal('show');
        }

        vm.changePageName = function(pageId){
            LoaderStart();
            var data = {
                query : {
                    id : pageId
                }
            }
            cmsManagementSrv.getPageContent(data).then(function(res){
                vm.contentModel.pageContent = res;
                LoaderStop();
            });
        }
    }
})();
