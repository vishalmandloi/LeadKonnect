 var app = angular.module('app');

 app.factory('commonSvc', ['aPIInterFace', function(api){
 	var svc = {};
 	svc.getMonths = function(){
 		var months = [
 		{key : 0, value : 'Select Month'},
 		{key : 1, value : 'January'},
 		{key : 2, value : 'February'},
 		{key : 3, value : 'March'},
 		{key : 4, value : 'April'},
 		{key : 5, value : 'May'},
 		{key : 6, value : 'June'},
 		{key : 7, value : 'July'},
 		{key : 8, value : 'August'},
 		{key : 9, value : 'September'},
 		{key : 10, value : 'October'},
 		{key : 11, value : 'November'},
 		{key : 11, value : 'December'}
 		];

 		return months;
 	}

 	svc.getYears = function(){
 		var initialYear = 2016;
 		var years = [{key : 0, value : 'Select Year'}];
        while(new Date().getFullYear() >=  initialYear){
            years.push({key : initialYear, value : initialYear});
            initialYear = initialYear + 1;
        }
        return years;
 	}
 	return svc;
 }]);