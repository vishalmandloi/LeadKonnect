/**
 * A data access layer psrovides a convenient interface for accessing the API
 */
(function () {
    var app = angular.module('app');

    app.directive('fallbackSrc', function () {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function () {
                    angular.element(this).attr("src", iAttrs.fallbackSrc);
                });
            }
        }
        return fallbackSrc;
    });

    app.config(function (ScrollBarsProvider) {
        ScrollBarsProvider.defaults = {
            scrollButtons: {
                scrollAmount: 'auto', // scroll amount when button pressed
                enable: false // enable scrolling buttons by default
            }
        };
    });

    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
     
                    event.preventDefault();
                }
            });
        };
    });

    app.factory('aPIInterFace', ['$http', '$q', function (http, q) {
        var aPIInterFace = {};

        aPIInterFace.doServiceCall = function (methodName, urlKey, postData, base) {
            var deferred = q.defer();

            var url = base=='admin'? apiRoutes.getAdminPath(urlKey) : apiRoutes.getPath(urlKey);
            //var urlLocal = apiRoutes.getPathLocal(urlKey);
            var urlValue = apiRoutes.url[urlKey];
            if (!urlValue || urlValue.length < 1) {
                deferred.reject('There are no url match for key ' + urlKey);
            }
            else {
                var httpRequest = {};
                if (postData && postData.params) {
                   angular.forEach(postData.params, function (value, key) { url = url.replace(':' + key, value);})
                }
                if (postData && postData.query) {
                   angular.forEach(postData.query, function (value, key) { url = url.replace(':' + key, value);})
               }
                httpRequest.url = url;
                httpRequest.method = methodName;
                httpRequest.crossDomain = true;
                httpRequest.headers = {
                    'Access-Control-Allow-Origin': '*.*.*'
                };

                if (methodName.toUpperCase() === 'PUT' || methodName.toUpperCase() === 'POST') {
                    httpRequest.data = JSON.stringify(postData);
                }

                http(httpRequest).success(function (response, status, header, config) {
                    deferred.resolve(response);
                }).error(function (data) {
                    deferred.reject(data);
                });

            }
            return deferred.promise

        };
        return aPIInterFace;

    }]);


    app.factory('getSetValues', function () {
        var factory = {};
        factory.setDetails = function (value) {
            factory.setValue = value;
        };

        factory.getDetails = function () {
            return factory.setValue;
        };

        return factory;
    });


    app.directive('passwordValidate', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {

                    scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
                    scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                    scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

                    if (scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber) {
                        ctrl.$setValidity('pwd', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('pwd', false);
                        return undefined;
                    }

                });
            }
        };
    });

 
    app.directive('schrollBottom', function () {
        return {
            scope: {
                schrollBottom: "="
            },
            link: function (scope, element) {
                scope.$watchCollection('schrollBottom', function (newValue) {
                    if (newValue)
                    {
                        $(element).scrollTop($(element)[0].scrollHeight);
                    }
                });
            }
        }
    });

})(window.app);