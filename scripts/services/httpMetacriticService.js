/**
Retrieves a JSON object from Metacritic using mashape.

@param config {Object} Must have the 'query' key.
@param config.query {string} URL-friendly full movie search query. For example, "inception".
@param? config.limit {string || "1"} Maximum search result pages to crawl. (Not sure what this means.)

@returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
**/
app.factory('httpMetacriticService', function($http, METACRITIC_API_KEY) {

    return function httpMetacriticService(config) {

        var data = {};
        data.max_pages = config.limit || '1';

        var url = 'https://byroredux-metacritic.p.mashape.com/search/movie';
        data.title = config.query;

        var headers = {"X-Mashape-Authorization": METACRITIC_API_KEY};

        return $http.post(url, data, {headers: headers});
    };

});