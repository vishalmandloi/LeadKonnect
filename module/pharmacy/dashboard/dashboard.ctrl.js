(function () {
	'use strict';
	angular.module('app')
	.controller('pharmacyDashboardCtrl', dashboardCtrl);

	function dashboardCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, locumSrv) {

		var vm = {};
		$scope.vm = vm;
		vm.GetDashbaordDataForPharmacy = GetDashbaordDataForPharmacy;
        var addresses = [];
        vm.favLocum = {};
		var total = 100;
		var currentUser = JSON.parse(localStorage.getItem('app-user'));
		vm.pharmacyName = currentUser.userName;
        GetFavoriteList();
		var profileStatus = {
			essentialDoc : '',
			identityInsurance: '',
			dbsCheck:'',
			declaration:'',
			itSystem:'',
			paymetAccDetail:'',
			localPrefSetting:''
		}

        //for profile complete
        if(profileStatus.essentialDoc == '')
        {
        	total = total-15;
        }
        if(profileStatus.identityInsurance == '')
        {
        	total = total-15;
        }
        if(profileStatus.dbsCheck == '')
        {
        	total = total-15;
        }
        if(profileStatus.declaration == '')
        {
        	total = total-15;
        }
        if(profileStatus.itSystem == '')
        {
        	total = total-5;
        } 
        if(profileStatus.paymetAccDetail == '')
        {
        	total = total-20;
        } 
        // if(profileStatus.localPrefSetting == '')
        // {
        // 	total = total-15;
        //}
        $scope.tot = total;

        vm.GetLatLongList = function(){
        var objReq = {
               query : {userId: currentUser.userId}
                }
        aPIInterFace.doServiceCall('Get', 'GetLatLongList', objReq).then(function (response) {
            console.log(response)
                if (response.Result) {
                    addresses = response.Result;
                    vm.locumLength = addresses.length;
                    $(document).ready(function () {
                        var map;
                        var elevator;
                        var myOptions = {
                            zoom: 7,
                            center: new google.maps.LatLng(55.122367, -2.636719),
                            mapTypeId: 'terrain'
                        };
                        map = new google.maps.Map($('#map_canvas')[0], myOptions);
                        angular.forEach(addresses,function(p){
                            var latlng = new google.maps.LatLng(p.latitude, p.longitude);
                            new google.maps.Marker({
                                position: latlng,
                                map: map
                            });
                        });
                    });
                }
            });
        };
        function GetFavoriteList(){
            var objReq = {
                   query : {userId: currentUser.userId}
                    }
                    locumSrv.getFavoriteList(objReq).then(function(response){
                    vm.favLocum = response.Result;  
                    vm.favoriteLoc = vm.favLocum.length;
                    })
        }

	    //--------GetDashbaordDataForPharmacy-----------
        function GetDashbaordDataForPharmacy() {
            if (currentUser.userId != undefined && currentUser.userId != null) {
                LoaderStart();
                var obj = {
                    userId: currentUser.userId
                }

                aPIInterFace.doServiceCall('Post', 'GetDashbaordDataForPharmacy', obj).then(function (response) {
                    console.log(response);
                    if (response.Success) {
                        vm.dashboardData = response.Result;
                        LoaderStop();
                    }
                    else {
                        alertService.add('danger', response.Message);
                        LoaderStop();
                    }
                });
            }
            else {
                alert('Invalid User')
            }
        }
    }
})();
