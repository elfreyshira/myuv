'use strict';

var angularModule = require('../app');

/**
Retrieves a JSON object from Rotten Tomatoes.

@param config {Object} Must have either the 'id' or 'query' key.
@param config.id {string} RT movie id. For example, "770805418" is Inception.
@param config.query {string} URL-friendly search query. For example, "incepti"...
@param? config.limit {string || "1"} Number of movie results.

@returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
**/
angularModule.factory('httpRottenService', function($http, RT_API_KEY) {

    return function httpRottenService(config) {

        var params = {};
        params.apiKey = RT_API_KEY;
        params.page_limit = config.limit || '1';
        params.callback = 'JSON_CALLBACK';

        var url;
        if (angular.isString(config.id)) {
            url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/'+ config.id +'.json';
        }
        else if (angular.isString(config.query)) {
            params.q = config.query;
            url = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json';
        }

        return $http.jsonp(url, {params: params});
    };

});
