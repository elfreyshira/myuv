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



/**
Retrieves a JSON object from Metacritic using mashape.

@param config {Object} Must have the 'query' key.
@param config.query {string} URL-friendly full movie search query. For example, "inception".
@param? config.limit {string || "1"} Maximum search result pages to crawl. (Not sure what this means.)

@returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
**/
angular.module('myuv').factory('httpMetacriticService', function($http, METACRITIC_API_KEY) {

    return function httpMetacriticService(config) {

        var data = {};
        data.max_pages = config.limit || '1';

        var url = 'https://byroredux-metacritic.p.mashape.com/search/movie';
        data.title = config.query;

        var headers = {"X-Mashape-Authorization": METACRITIC_API_KEY};

        return $http.post(url, data, {headers: headers});
    };

});


/**
Retrieves a JSON object from Rotten Tomatoes.

@param config {Object} Must have either the 'id' or 'query' key.
@param config.id {string} RT movie id. For example, "770805418" is Inception.
@param config.query {string} URL-friendly search query. For example, "incepti"...
@param? config.limit {string || "1"} Number of movie results.

@returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
**/
angular.module('myuv').factory('httpRottenService', function($http, RT_API_KEY) {

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



/**
Retrieves a JSON object from TMDB.

@param config {Object} Must have either the 'id' or 'query' key.
@param config.id {string} IMDB movie id. For example, "tt1375666" is Inception.
@param config.query {string} URL-friendly search query. For example, "incepti"...

@returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
**/
angular.module('myuv').factory('httpTmdbService', function($http, TMDB_API_KEY) {

    return function httpTmdbService(config) {

        var params = {};
        params.api_key = TMDB_API_KEY;
        params.callback = 'JSON_CALLBACK';

        var url;
        if (angular.isString(config.id)) {
            url = 'http://api.themoviedb.org/3/movie/' + config.id;
        }
        else if (angular.isString(config.query)) {
            params.query = config.query;
            url = 'http://api.themoviedb.org/3/search/movie';
        }

        return $http.jsonp(url, {params: params});
    };

});
