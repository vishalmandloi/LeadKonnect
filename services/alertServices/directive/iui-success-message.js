(function(){
  'use strict';
  angular.module('app')
  .directive('iuiSuccessMessage', ['$sce', function ($sce) {
    return {
      restrict: 'E',
      scope: {
        successMessage: '=',
        id:'='
      },
      templateUrl: 'services/alertServices/templates/iui-success-message.html',
      controller: function ($scope, $sce,alertService) {
        $scope.getTrustedHtml = function (message) {
          if (message) {
            return $sce.trustAsHtml(message);
          }
        };

        $scope.closeAlert =function(){
          alertService.closeAlert($scope.id);
        }
      }
    };
  }]);

})();