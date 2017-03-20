 var app = angular.module('app');

 app.factory('jobsSvc', ['aPIInterFace', function(api){
 	var svc = {};
 	svc.GetAllJobsForHeadOffice = function(request){
 		return api.doServiceCall('Post', 'GetAllJobsForHeadOffice', request, 'admin').then(function (response) {
			return response;
		}, function(error){});
 	}
 	return svc;
 }]);