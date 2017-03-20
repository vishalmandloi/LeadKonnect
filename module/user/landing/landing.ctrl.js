(function () {
    'use strict';
    angular.module('app')
      .controller('landingCtrl', landingCtrl);

    function landingCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q) {

        var vm = {};
        $scope.vm = vm;
        
    }
})();
