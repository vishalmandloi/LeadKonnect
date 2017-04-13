(function () {
    'use strict';
    angular.module('app')
      .controller('innerUserLayoutCtrl', innerUserLayoutCtrl);

    function innerUserLayoutCtrl($scope, $state, $stateParams, $location, AuthSrv, aPIInterFace, StorageUtils, UserSrv, $rootScope, postService) {
        var vm = {};
        $scope.vm = vm;
        vm.currentUser = JSON.parse(localStorage.getItem('app-user'));
        vm.logout = logout;
        vm.createlead = createlead;
        vm.searchType = "0";
        vm.createFor = "0";
        vm.notifications = [];
        vm.updatenotificationcount = updatenotificationcount;
        vm.init = function(){
            GetNotifications();
            if(postService.item.searchText || postService.item.searchFor){
                vm.text = postService.item.searchText;
                vm.searchType = postService.item.searchFor;
            }
        };
        $rootScope.$on('$stateChangeStart', function (e, toState, currentState) {
           if(toState.name == 'user.createlead'){
                $('.search-select').css('display','none');
           }
           else{
            $('.search-select').css('display','inline-block');
           }
        });        
        vm.searchData = function(text, type){
            LoaderStart();
            var objReq={
              searchText: text || '',
              searchFor: type || '0'
            }
            var body ={
                query:objReq
            }
            aPIInterFace.doServiceCall('Get', 'GetPosts', body).then(function (response) {
                if (response.Success) {
                      LoaderStop();
                    postService.item.searchData = response.Result;
                    if($state.current.name == 'user.dashboard'){
                        $state.reload();
                    }else{
                        $state.go('user.dashboard');
                    }
                }
                else {
                    LoaderStop();
                }
            });
            postService.item.searchText = text || '';
            postService.item.searchFor = type || '0';
        };

         $state.reload = function reload() {
            $state.transitionTo($state.current, $stateParams, { reload: true, inherit: true, notify: true });
        };

        function logout() {
            AuthSrv.logout().then(function () {
                UserSrv.delete();
                $state.go('user1.home');
                LoaderStop();
            });
        };

        function createlead(vcreateFor) {
            if(vcreateFor!="0"){
                $state.go('user.createlead',{tab:vcreateFor});
            }
            else{
                 $state.go('user.dashboard');
            }
        };

       function GetNotifications(){
            var objReq={
              userId:vm.currentUser.UserId
            }
            var body ={
                  query:objReq
               }

            aPIInterFace.doServiceCall('Get', 'GetNotificationds', body).then(function (response) {
                if (response.Success) {
                    debugger;
                    vm.notifications = response.Result;
                }
                else {
                }
            });
        }           

        function updatenotificationcount(){
            var objReq={
              userId:vm.currentUser.UserId
            }

            aPIInterFace.doServiceCall('Post', 'UpdateNotificationCount', objReq).then(function (response) {
                if (response.Success) {
                }
                else {
                }
            });            

        }


    };

})();
