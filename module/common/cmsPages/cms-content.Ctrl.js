(function(){
	'use strict';
	angular.module('app')
	.controller('cmsCtrl', cmsCtrl);
	function cmsCtrl($scope, $location, cmsManagementSrv){
		var vm = {};
		$scope.vm = vm;

		vm.init = function(){
			LoaderStart();
			var path = $location.url();
			var parms = path.split('/');
			vm.pageTitle = parms[parms.length-2].replace(/%20/g, " ");
			var pageId = parms[parms.length-1];
			if (pageId) {
				cmsManagementSrv.getPageContent({query : {id : pageId }}).then(function(res){
					vm.pageBody = res;
					LoaderStop();
				});
			}

		}

	}
})();
