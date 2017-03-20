
(function () {
    'use strict';
    angular.module('app')
      .factory('locumSrv', locumSrv)
    locumSrv.$inject = [ 'aPIInterFace'];
    function locumSrv( aPIInterFace) {
        var service = {
            getFavoriteList: GetFavoriteList,
            removeFavoriteList: RemoveFavoriteList
        };
        return service;

        function GetFavoriteList(id) {
             return aPIInterFace.doServiceCall('Get', 'GetFavoriteList', id).then(function (res) {
                   return res;
            });
        }

        function RemoveFavoriteList(id) {
             return aPIInterFace.doServiceCall('Post', 'AddFavorite', id).then(function (res) {
                return res; 
            });
        }


        }
})();

