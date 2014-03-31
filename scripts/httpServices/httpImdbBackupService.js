'use strict';

require('angular');

function imdbBackupCallback(json) {
    console.log("callback!!!!!!!!!!!!");
    console.log(json);
    return json;
}

// *************
// *************
// DO THIS!!!!!!!!! http://jsfiddle.net/Xbf6C/1/
// *************

/**
Used only when the httpImdbService doesn't work. Retrieves a JSON object from IMDB.

@param config {Object} Must have either the 'id' or 'query' key.
@param config.id {string} IMDB movie id. For example, "tt1375666" is Inception.
@param config.query {string} URL-friendly search query. For example, "inceptio"...
@param config.year? {string} 4-digit year

@returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
**/
angular.module('myuv').factory('httpImdbBackupService', function($http) {

    return function httpImdbBackupService(config) {
        var params = {};
        params.callback = 'JSON_CALLBACK';
        params.type = 'json';

        var url = 'http://deanclatworthy.com/imdb/';
        if (angular.isString(config.id)) {
            params.id = config.id;
        }
        else if (angular.isString(config.query)) {
            params.q = config.query;
        }

        var headers = {
            // 'Content-Type': 'application/json'
            'Content-Type': 'application/javascript'
        };
        // application/json
        // Content-Type
        var response = $http.jsonp(url, {params: params, headers: headers});

        response.then(function(data) {
            console.log("then data!!!!!!!!!!!!!");
            console.log(data);
        });
        console.log("!!!!!!!!!!!!!");
        console.log(response);
        return response;


        /**********
        **************
        this isn't working yet because i ran out of api usage
        there seems to be failure in multiple ways
        1) if i set callback to 'JSON_CALLBACK', it says it can't find the angular call back
        2) if i take that out but keep int the json stuff,
            it looks for some callback called 'imdbapi'. it works if i make the function globally available.
        3) if i take out the json and callback stuff, it has the old failure of "Uncaught SyntaxError: Unexpected token : "
        .
        */

    };
});
