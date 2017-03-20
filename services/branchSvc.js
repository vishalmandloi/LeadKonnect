 var app = angular.module('app');

 app.factory('branchSvc', ['aPIInterFace', function(api){
 	var svc = {};
 	svc.GetBranches = function(officeId){
		 return api.doServiceCall('Post', 'GetBranchList', {userId: officeId}).then(function (response) {
			return response;
		});
 	}
 	return svc;
 }]);