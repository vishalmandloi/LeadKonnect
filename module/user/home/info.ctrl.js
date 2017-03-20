(function () {
	'use strict';
	angular.module('app')
	  .controller('infoCtrl', infoCtrl);

	function infoCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $stateParams) {
		debugger;
		var pageId = $stateParams.id;
		var vm = {};
		$scope.vm = vm;

		vm.GetContentByPageName = GetContentByPageName;


		function GetContentByPageName() {
			var obj = {
				pageId:pageId
			}
			aPIInterFace.doServiceCall('Post', 'GetContentByPageName', obj, 'admin').then(function (response) {
				console.log(response);
				if (response.Success) {
					vm.data = response.Result;
				}
				else {
					alert(response.Message)
				}
			});
		}

	}
})();
