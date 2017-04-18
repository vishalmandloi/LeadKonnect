(function () {
    'use strict';
    angular.module('app')
      .controller('dashboardCtrl', dashboardCtrl);

    function dashboardCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q,$compile,uiCalendarConfig,$timeout, $state, postService, $stateParams) {
    	debugger
    	var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;

        vm.init = function(){
        	vm.posts = postService.item.searchData;
        	if(!vm.posts || !$stateParams.tab){
				    GetPosts();
        	}
        }

       function GetPosts(){
       		LoaderStart();
       		var objReq={
			  searchText:'',
			  searchFor:0
       		}
			var body ={
                  query:objReq
               }

            aPIInterFace.doServiceCall('Get', 'GetPosts', body).then(function (response) {
                if (response.Success) {
                	LoaderStop();
                    vm.posts = response.Result;
                    postService.item.searchData = response.Result;
                }
                else {
                	LoaderStop();
                }
            });
        }
    	
    }
})();
