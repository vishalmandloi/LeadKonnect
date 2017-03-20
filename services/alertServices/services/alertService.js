(function(){
  'use strict';
  angular.module('app')
  .factory('alertService', alertService)


  alertService.$inject = ['$location', '$timeout'];
  function alertService(loc, to){
      var defaultTimeOut = 10000,
      placements = {},
      callback = '',
      DEFAULT_PLACEMENT = 'alert_app-top';

    return {
      getCurrent: function (id) {
        return placements[id || DEFAULT_PLACEMENT];
      },

      addPlacement: function (id) {
        if (!placements[id]) {
          placements[id] = {};
        }
      },

      /* add alert */
      add: function (type, message, activeFor, callback, placement) {
        placement = placement || DEFAULT_PLACEMENT;
        var currentPlacement = placements[placement];
        if (!currentPlacement) {
          currentPlacement = placements[placement] = {};
        }

        // if the message is an error, it does not need a timeout
        /*if (type === 'danger') {
          activeFor = 0;
        }*/

        currentPlacement.callback = callback;

        currentPlacement.alert = {
          type: type,
          message: message,
          placement: placement,
          activeFor: activeFor,
          close: function () {
            return asvc.closeAlert();
          }
        };

        if (currentPlacement.promise) {
          to.cancel(currentPlacement.promise);
        }

        if (activeFor === 0) {
          return;
        }

        currentPlacement.promise = to(function () {
          currentPlacement.alert = {};
          if (currentPlacement.callback)
            currentPlacement.callback();
        }, (activeFor !== undefined) ? activeFor : defaultTimeOut);

      },

      /* close alert */
      closeAlert: function (id) {
        var placement = this.getCurrent(id);
        placement.alert = {};
        to.cancel(placement.promise);
        if (placement.callback)
          placement.callback();
      },

      clearAll: function () {
        _.each(placements, function (placement) {
          placement.alert = {};
          to.cancel(placement.promise);
        });
      },

      /* clear alert */
      clear: function (id) {
        if (id) {
          var current = this.getCurrent(id);
          if (!current)
            return;
          current.alert = {};
          to.cancel(current.promise);
        } else {
          this.clearAll();
        }

      }

    };

  }

})();
