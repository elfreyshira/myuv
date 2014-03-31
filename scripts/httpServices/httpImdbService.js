'use strict';

require('angular');

/**
Retrieves a JSON object from IMDB.

@param config {Object} Must have either the 'id' or 'query' key.
@param config.id {string} IMDB movie id. For example, "tt1375666" is Inception.
@param config.query {string} URL-friendly full movie title query. For example, "inception".

@returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
**/
angular.module('myuv').factory('httpImdbService', function($http) {

    return function httpImdbService(config) {
        var params = {};
        params.callback = 'JSON_CALLBACK';

        var url = 'http://www.imdbapi.com';
        if (angular.isString(config.id)) {
            params.i = config.id;
        }
        else if (angular.isString(config.query)) {
            params.t = config.query;
        }

        return $http.jsonp(url, {params: params});

    };
});
