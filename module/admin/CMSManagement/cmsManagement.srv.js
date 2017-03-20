
(function () {
    'use strict';
    angular.module('app')
      .factory('cmsManagementSrv', cmsManagementSrv)

    cmsManagementSrv.$inject = ['$http', 'UserSrv', 'StorageUtils', 'Config', 'aPIInterFace'];
    function cmsManagementSrv($http, UserSrv, StorageUtils, Config, aPIInterFace) {
        var service = {
            getPageContent: getPageContent,
            submitCms: submitCms
        };
        return service;

        function getPageContent(id) {
             return aPIInterFace.doServiceCall('Get', 'GetContent', id, 'admin').then(function (response) {
               return response.Result.pageContent;
            });
        }

         function submitCms(data) {
             return aPIInterFace.doServiceCall('Post', 'AddUpdatePageContent', data, 'admin').then(function (response) {
                return response;
            });
        }

        }
})();

