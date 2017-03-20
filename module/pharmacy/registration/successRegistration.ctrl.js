(function () {
    'use strict';
    angular.module('app')
      .controller('successRegistrationCtrl', successRegistrationCtrl);

    function successRegistrationCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $state) {

        var vm = {};
        $scope.vm = vm;
       
    }
})();
