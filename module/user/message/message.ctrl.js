(function () {
    'use strict';
    angular.module('app')
      .controller('messageCtrl', messageCtrl);

    function messageCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $timeout) {
        var currentUser = JSON.parse(localStorage.getItem('app-user'));
        var vm = {};
        $scope.vm = vm;



    }
})();