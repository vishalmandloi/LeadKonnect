(function () {
    'use strict';
    angular.module('app')
      .controller('leadCtrl', leadCtrl);

    function leadCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, commonSvc, dialogs, alertService,$stateParams,$state) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;
        vm.init = init;
        vm.categories=[];
        vm.subcategories=[];
        vm.leadneeds=[];
        vm.leadtypes=[];
        vm.showdetails=[];
        vm.Reset=Reset;
        vm.GetCategories=GetCategories;
        vm.GetSubCategories=GetSubCategories;
        vm.GetNeeds=GetNeeds;
        vm.GetNeedTypes=GetNeedTypes;
        vm.GetShowDetails=GetShowDetails;
        vm.CreatePost=CreatePost;
        vm.init();
        function init() {
         
         vm.GetCategories();
         vm.GetNeeds();
         vm.GetNeedTypes();
         vm.GetShowDetails();
        }
        vm.Reset();
        function Reset(){
            vm.postModel={
                      "Title": "",
                      "PostFor": $stateParams.tab,
                      "CategoryId": "0",
                      "SubcategoryId": "0",
                      "OtherCategory": "",
                      "Location": "",
                      "Latitude": "0",
                      "Longitude": "0",
                      "SharePercentage": "",
                      "LeadAmount": "",
                      "LeanNeed": "0",
                      "ShowDetails": "0",
                      "LeanType": "0",
                      "Description": "",
                      "UserId": currentUser.UserId
                    }
        }

        function GetCategories(){
            aPIInterFace.doServiceCall('Get', 'GetCategories', null).then(function (response) {
                if (response.Success) {
                    vm.categories = response.Result;
                }
                else {
                }
            });
        }

        function GetSubCategories(category){
           vm.subcategories = [];
            vm.subcategories = _.find(vm.categories, function(category){return category.CategoryId == vm.postModel.CategoryId}).lstSubCategory;
            vm.postModel.SubcategoryId="0";
        }

        function GetNeeds(){
            aPIInterFace.doServiceCall('Get', 'GetNeeds', null).then(function (response) {
                if (response.Success) {
                    vm.leadneeds = response.Result;
                }
                else {
                }
            });
        }

        function GetNeedTypes(){
            aPIInterFace.doServiceCall('Get', 'GetNeedTypes', null).then(function (response) {
                if (response.Success) {
                    vm.leadtypes = response.Result;
                }
                else {
                }
            });
        }

        function GetShowDetails(){
            aPIInterFace.doServiceCall('Get', 'GetShowDetails', null).then(function (response) {
                if (response.Success) {
                    vm.showdetails = response.Result;
                }
                else {
                }
            });
        }  

        function CreatePost(){
            // if (vm.myDataFForm.$valid){
                LoaderStart();
                aPIInterFace.doServiceCall('Post', 'CreatePost', vm.postModel).then(function (response) {
                    if (response.Success) {
                        vm.Reset();
                        //alertService.add('success', response.Message);
                        LoaderStop();
                        alert(response.Message);
                        //$state.go('user.dashboard');
                        $state.go('user.dashboard',{tab:1});
                         
                    } else {
                        //alertService.add('danger', response.Message);
                        alert(response.Message);
                        LoaderStop();
                    }
                });  
           
            // }else {
            //     LoaderStop();
            // }

        }
        //Interpreters form submit end                      

    }
})();
