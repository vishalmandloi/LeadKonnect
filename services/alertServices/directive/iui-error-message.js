(function(){
  'use strict';
  angular.module('app')
  .directive('iuiErrorMessage', ['$sce', function ($sce) {
    return {
      restrict: 'E',
      scope: {
        errorMessage: '=',
        id:'='
      },
      templateUrl: 'services/alertServices/templates/iui-error-message.html',
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