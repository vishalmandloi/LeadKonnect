(function () {
    'use strict';
    angular.module('app')
      .controller('userManagementCtrl', userManagementCtrl);

    function userManagementCtrl($scope, $state, StorageUtils, aPIInterFace, dialogs,alertService) {
        var vm = {};
        $scope.vm = vm;
        vm.GetAllLocums = GetAllLocums;
        vm.role = StorageUtils.getSync('role');
        vm.locumList = [];
        vm.searchText = null;
        vm.confirmbox = confirmbox;
        vm.viewDocuments = viewDocuments;
        vm.siteUrl = Config.imagePath;

        vm.SuccessMsg = null;
        vm.ErrorMsg = null;

        ///----GetAllLocum for Admin
        function GetAllLocums() {
            LoaderStart();
            vm.locumList = [];
            var obj = {
                PageNumber: 1,
                Searchword: vm.searchText
            };

            aPIInterFace.doServiceCall('Post', 'GetAllLocums', obj, 'admin').then(function (response) {
                console.log(response);
                if (response.Success) {
                    vm.locumList = response.Result;
                    LoaderStop();
                }
                else {
                    alert(response.Message)
                    LoaderStop();
                }
            });

        }

        function confirmbox(action, d) {
            vm.SuccessMsg = null;
            vm.ErrorMsg = null;
            var dlg = dialogs.confirm('Confirmation', "Are you sure,you want to " + action + ' this');
            dlg.result.then(function (btn) {
                LoaderStart();
                var obj = {
                    page: 'user',
                    colName: action,// == 'Delete' ? 'isDelete' : 'isActive',
                    value: (action == 'Block') ? false : true,//------In Delete and Block case: true else UnBlock Case: false
                    id: d.locumId
                };

                aPIInterFace.doServiceCall('Post', 'UpdateIsActiveAndIsDelete', obj, 'admin').then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        if (action == "Delete") {
                            vm.SuccessMsg = response.Message;
                            GetAllLocums();
                            LoaderStop();
                        }
                        else {
                            vm.SuccessMsg = response.Message;;
                            obj.isActive = !obj.isActive;
                            GetAllLocums();
                            LoaderStop();
                        }

                    }
                    else {
                        alert(response.Message)
                        LoaderStop();
                    }
                });
            }, function (btn) {
            });
        }

        function viewDocuments(d) {
            vm.doccument=null;
            var objReq = {
                userId: d.locumId
                // userId: '1'
            }
            console.log(objReq);

            aPIInterFace.doServiceCall('Post', 'GetDocumentsAndDeclarations', objReq).then(function (response) {
                console.log(response);
                if (response.Success) {
                    vm.doccument = response.Result;

                    LoaderStop();
                }
                else {
                    alertService.add('danger', response.Message);
                    LoaderStop();
                }
            });
            $('#document_poup').modal('show');
        }

        //var pg = 0;
        //var listData = [];
        //function GetAllLocums() {

        //    LoaderStart();

        //    $scope.tableParams = new ngTableParams({
        //        page: 1,
        //        count: 10,
        //        sorting: false
        //        //filter: {
        //        //    name: 'venueName'       // initial filter
        //        //}
        //    }, {
        //        getData: function ($defer, params) {

        //            LoaderStart();
        //            var pageNumber = params.$params.page;
        //            var pageSize = params.$params.count;

        //            if (pg != pageNumber || $scope.searchfunc) {
        //                var obj = {
        //                    PageNumber: pageNumber,
        //                    Searchword: ''
        //                };

        //                pg = pageNumber;
        //                // obj.status = scopeFit || 'Pending';
        //                // send an ajax request to your server. in my case MyResource is a $resource.

        //               // var baseUrl = siteUrl + '/api/FactoryAdminServices/GetGroupsByFactoryAdmin';
        //                var d = aPIInterFace.doServiceCall('Post', 'GetAllLocums', obj, 'admin').then(function (response) {
        //                    console.log(response);
        //                    listData = response.Result;
        //                    if (listData.length <= 0) {
        //                        $defer.resolve(0);
        //                    }
        //                    else if (listData.length > 0) {

        //                        var orderedData = params.sorting() ?
        //                            $filter('orderBy')(listData, params.orderBy()) : listData;

        //                        params.total(orderedData.length);
        //                        $scope.tableParams.total(orderedData[0].totalCount);
        //                        $defer.resolve(orderedData);

        //                    }
        //                    else {
        //                        $scope.reload = true;
        //                    }

        //                    LoaderStop();
        //                });
        //            }
        //            else {
        //                //var array = orderedData;
        //                var orderedData = params.sorting() ?
        //                           $filter('orderBy')(listData, params.orderBy()) : listData;

        //                params.total(orderedData.length);
        //                $scope.tableParams.total(orderedData[0].totalCount);
        //                $defer.resolve(orderedData);
        //                LoaderStop();
        //            }
        //        }
        //    });
        //}
    }


})();
