(function () {
    'use strict';
    angular.module('app')
      .controller('messageCtrl', messageCtrl);

    function messageCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $timeout) {
         var vm = {};
        $scope.vm = vm;
        vm.currentUser = JSON.parse(localStorage.getItem('app-user'));
        vm.ChatUserId = 0 ;
        vm.ChatUserName = '';
        vm.GetMessages = GetMessages;
        vm.MessageText = '';
        vm.SendMessage = SendMessage;
        vm.init = function(){
            GetPartners();
        }

       function GetPartners(){
            LoaderStart();
            var objReq={
              userId:vm.currentUser.UserId
            }
            var body ={
                  query:objReq
               }

            aPIInterFace.doServiceCall('Get', 'GetPartners', body).then(function (response) {
                if (response.Success) {
                    LoaderStop();
                    vm.partners = response.Result;
                }
                else {
                    LoaderStop();
                }
            });
        }     

        function GetMessages(req){
        	LoaderStart();
        	vm.ChatUserName = req.FirstName + ' ' + req.LastName;
        	if(req.RequestFrom==vm.currentUser.UserId){
        		vm.ChatUserId = req.PartnerId;
        	}
        	else{
				vm.ChatUserId = req.RequestFrom;
        	}
            var objReq={
              userId:vm.currentUser.UserId,
              toId:vm.ChatUserId
            }
            var body ={
                  query:objReq
               }
            aPIInterFace.doServiceCall('Get', 'GetMessages', body).then(function (response) {
                if (response.Success) {
                    LoaderStop();
                    vm.messages = response.Result;
                    debugger
                }
                else {
                    LoaderStop();
                }
            });


        }


        function SendMessage(){
            // if (vm.myDataFForm.$valid){
            if(vm.MessageText!=''){
		            var objReq={
		              UserId:vm.currentUser.UserId,
		              ToId:vm.ChatUserId,
		              Message:vm.MessageText

		            }            	
	                LoaderStart();
	                aPIInterFace.doServiceCall('Post', 'SendMessage', objReq).then(function (response) {
	                    if (response.Success) {
	                       
	                        LoaderStop();
	                        vm.messages.push({UserId:vm.currentUser.UserId,ToId:vm.ChatUserId,Message:vm.MessageText});
	                        vm.MessageText = ''
	                         
	                    } else {
	                        //alertService.add('danger', response.Message);
	                        alert(response.Message);
	                        LoaderStop();
	                    }
	                });  
            }
        }


    }
})();