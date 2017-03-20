(function () {
    'use strict';
    angular.module('app')
      .config(configure);

    function configure($stateProvider) {
        $stateProvider
            .state('admin.content', {
                url: '/content/:pageName/:pageId',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'module/common/cmsPages/cms-content.html',
                        controller: 'cmsCtrl'
                    }
                }
            });

    }


})();
