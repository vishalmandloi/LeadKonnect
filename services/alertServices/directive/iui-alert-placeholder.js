(function(){
  'use strict';
  angular.module('app')
  .directive('iuiAlertPlaceholder', ['alertService', function (alertService) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'services/alertServices/templates/iui-alert-placeholder.html',

      link: function (scope, element, attrs) {
        scope.alertId = attrs.id;
        // The id is used as the unique identifier for the alertService.
        // Always prefix the id with `alert_` like `alert_wizard-step`
        // This prefix allows us to easily identify alerts in the codebase
        alertService.clear();
        alertService.addPlacement(scope.alertId);
        scope.placementAlerts = alertService.getCurrent(scope.alertId);
      }

    };
  }]);

})();