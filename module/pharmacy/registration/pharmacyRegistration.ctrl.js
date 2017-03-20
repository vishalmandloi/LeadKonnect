(function () {
    'use strict';
    angular.module('app')
      .controller('pharmacyRegCtrl', pharmacyRegCtrl);

    function pharmacyRegCtrl($scope, $http, UserSrv, $modal, aPIInterFace, $q, $state) {

        var vm = {};
        $scope.vm = vm;
        vm.signup = signup;

        function signup() {
            alert(1)
            $state.go('user1.locumsignup2');
        }
    }
})();
