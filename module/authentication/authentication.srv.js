(function () {
    'use strict';
    angular.module('app')
      .factory('AuthSrv', AuthSrv)
      .factory('AuthInterceptor', AuthInterceptor);

    AuthSrv.$inject = ['$http', 'UserSrv', 'StorageUtils', 'Config'];
    function AuthSrv($http, UserSrv, StorageUtils, Config) {
        var service = {
            login: login,
            forgot: forgot,
            changePassword: changePassword,
            getRole: getRole,
            createUser: createUser,
            logout: logout,
            isLogged: isLogged
        };
        return service;

        function login(credentials) {


            return $http.get(Config.backendUrl + 'userLogin?userId=' + credentials.userId + '&password=' + credentials.password + '&loginType=' + credentials.loginType).then(function (res) {


                var user = res.data.Result;

                var roleOfUser = (user.userType == "1") ? 'admin' : (user.userType == "2") ? 'user' : (user.userType == "3") ? 'headoffice' : 'user';

                StorageUtils.set('role', roleOfUser);

                return UserSrv.set(user).then(function () {
                    return res.data;
                });
            });



            //var user = {};
            //user.isLogged = true;
            //user.logged = true;
            //user.IsLoginWithTempPassword = false;

            var roleOfUser = (user.RoleId == 1) ? 'superAdmin' : 'user';

            StorageUtils.set('role', roleOfUser);

            return UserSrv.set(user).then(function () {
                return user;
            });

            return user;


        }

        function forgot(credentials) {

            return$http.get(Config.backendUrl + 'auth/password/forgetmail?userName=' + credentials.userName).success(function (response) {
                return response
            })
            .error(function (response) {
            });
        }

        function changePassword(credentials) {

            $http.post(Config.backendUrl + 'auth/password/change?userName=' + credentials.UserName + '&newPassword=' + credentials.password + '&OldPassword=' + credentials.oldPassword).success(function (response) {
                $state.go('main.dashboard');
            })
            .error(function (response) {

            });
        }

        function logout() {
            return UserSrv.get().then(function (user) {
                user.logged = false;
                StorageUtils.remove('role');
                return UserSrv.set(user);
            });
        }


        function getRole() {

            return $http.get(Config.backendUrl + 'Roles').success(function (response) {
                return _.result(_.find(response, function (result) { return result.RoleName === "customer" }), 'Id')
            });
        }

        function createUser(user) {

            return $http({
                method: "post",
                url: Config.backendUrl + 'User',
                data: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                return response;
            });
        }


        function isLogged() {
            var user = StorageUtils.getSync(UserSrv.storageKey);
            return user && user.logged === true;
        }
    }

    AuthInterceptor.$inject = ['$q', '$location', '$log'];
    function AuthInterceptor($q, $location, $log) {
        var service = {
            request: onRequest,
            response: onResponse,
            responseError: onResponseError
        };
        return service;

        function onRequest(config) {
            // add headers here if you want...
            return config;
        }

        function onResponse(response) {
            return response;
        }

        function onResponseError(response) {
            $log.warn('request error', response);
            if (response.status === 401 || response.status === 403) {
                // user is not authenticated
                $location.path('/login');
            }
            return $q.reject(response);
        }
    }
})();
