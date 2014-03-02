/**
Retrieves a JSON object from TMDB.

@param config {Object} Must have either the 'id' or 'query' key.
@param config.id {string} IMDB movie id. For example, "tt1375666" is Inception.
@param config.query {string} URL-friendly search query. For example, "incepti"...

@returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
**/
app.factory('httpTmdbService', function($http, TMDB_API_KEY) {

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
