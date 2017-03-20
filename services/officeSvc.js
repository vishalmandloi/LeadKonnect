  var app = angular.module('app');

 app.factory('officeSvc', ['aPIInterFace', function(api){
 	var svc = {};
 	svc.GetSubOffices = function(officeId){
		return api.doServiceCall('Post', 'GetAllSubOffice', {headOfficeId: officeId}).then(function(response){
			return response;
		});
 	}
 	return svc;
 }]);

