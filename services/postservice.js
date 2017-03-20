(function () {
    'use strict';
    	angular.module('app').service('postService', postService)

    	postService.$inject = [];

    	function postService(){
    		this.item = {};
    	};

   })();