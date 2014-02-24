/**

app.controller('PageController'
app.factory('getResultsWithTitle'
app.factory('rottenService'
app.factory('imdbService'
app.factory('tmdbService'
app.factory('metacriticService'
app.factory('imdbBackupService'


    **/
/**
Notes:

- use _.debounce for autocomplete stuff
- https://code.google.com/p/crypto-js/
**/


var app = angular.module('myuv', []);

app.constant('RT_API_KEY', 'f278acux2dr8vmmueege9bfv');
app.constant('TMDB_API_KEY' ,'bb0d9620f620e8097998203a8af18aec');
app.constant('METACRITIC_API_KEY' ,'iR4qVOE5vZSwTxgEfqalscz1ycR8G21K');

app.value('testing', function() {
    return {
        searchKey: Date.now()
    };
});


app.controller('PageController',
    function($scope, rottenService, imdbService, tmdbService, metacriticService, imdbBackupService, $window, getResultsWithTitle) {

        $scope.movieSearchResults = [];

        $scope.hello = "hi";
        $scope.fetch = function(title) {

            var config = {
                query: title
                // id: 'tt1375666'
            };

            getResultsWithTitle(title, $scope);

            // rottenService(config)
            // .success(function(data, status) {
            //     $scope.rt = data;
            // });

            // imdbService(config)
            // .success(function(data, status) {
            //     $scope.imdb = data;
            // });

            // tmdbService(config)
            // .success(function(data, status) {
            //     $scope.tmdb = data;
            // });

            // metacriticService(config)
            // .success(function(data, status) {
            //     $scope.meta = data;
            // });

            // imdbBackupService(config)
            // .success(function(data, status) {
            //     console.log("success!!!!!!!!");
            //     $scope.imdb_backup = data;
            // });
            //

        };

        $window.fetch = $scope.fetch;
        $window.show = function() {
            console.log(JSON.stringify($scope.movieSearchResults, null, 4));
        }

    });

app.factory('updateScope', function() {
    return function updateScope(resultObj, rating, scope) {

    }
});

/** getResultsWithTitle

Given a movie title query, get the ratings from all sources and update the scope with it.

$scope.movieSearchResults = [
    {
        searchKey: 123,
        title: 'Inception',
        runtime: 148, //minutes,
        mpaaRating: 'PG-13',
        rtId: '770805418',
        imdbId: 'tt1375666',
        rtCritics: {
            rating: 86,
            outOf: '%',
            link: 'http://www.rottentomatoes.com/m/inception/'
        },
        rtAudience: {
            rating: 91,
            outOf: '%',
            link: 'http://www.rottentomatoes.com/m/inception/'
        },
        imdb: {
            rating: '8.8',
            outOf: '10',
            link: 'http://www.imdb.com/title/tt1375666/'
        },
        tmdb: {
            rating: '7.4',
            outOf: '10',
            link: 'http://www.themoviedb.org/movie/27205-inception'
        },
        metaCritics: {
            rating: '74',
            outOf: '100',
            link: 'http://www.metacritic.com/movie/inception'
        },
        metaUsers: {
            rating: '8.6',
            outOf: '10',
            link: 'http://www.metacritic.com/movie/inception'
        }
    },
    {movie1...},
    {movie2...}
]

@param title {string} Movie title.
@param scope {Object} The angular $scope.

@returns null
**/

app.factory('getResultsWithTitle', function($q, rottenService, imdbService, tmdbService, metacriticService) {

    return function getResultsWithTitle(title, scope) {
        // _.find(movies, {searchKey:2})

        var resultObj = {
            searchKey: Date.now()
        };

        rottenService({query: title})
        .success(function(data) {

            var rtMovieObj = data.movies[0];

            resultObj.title = rtMovieObj.title;
            resultObj.runtime = rtMovieObj.runtime;
            resultObj.mpaaRating = rtMovieObj.mpaa_rating;
            resultObj.rtId = rtMovieObj.id;
            resultObj.imdbId = 'tt' + rtMovieObj.alternate_ids.imdb;

            var rtDefaultObj = {
                outOf: '%',
                link: rtMovieObj.links.alternate
            };

            resultObj.rtCritics = _.merge({}, rtDefaultObj, {rating: rtMovieObj.ratings.critics_score});
            resultObj.rtAudience = _.merge({}, rtDefaultObj, {rating: rtMovieObj.ratings.audience_score});

            scope.movieSearchResults.unshift(resultObj);


            var imdbId = resultObj.imdbId;
            imdbService({id: imdbId})
            .success(function(data) {

                resultObj.imdb = {
                    outOf: '10',
                    link: 'http://www.imdb.com/title/' + imdbId,
                    rating: data.imdbRating
                };

            });

            tmdbService({id: imdbId})
            .success(function(data) {

                resultObj.tmdb = {
                    outOf: '10',
                    // http://www.themoviedb.org/movie/25523-shrek-4-d
                    link: 'http://www.themoviedb.org/movie/' + data.id + '-' + data.title.replace(/\W+/g,'-'),
                    rating: data.vote_average
                };

            });

            // TODO: Find the right movie out of the results. Use lodash or something.
            // fetch('batman begins') returns 'dark knight' as first result.
            metacriticService({query: resultObj.title})
            .success(function(data) {

                var metaMovieObj = data.results[0];

                resultObj.metaCritics = {
                    rating: metaMovieObj.score,
                    outOf: '100',
                    link: metaMovieObj.url
                };

                resultObj.metaUsers = {
                    rating: metaMovieObj.avguserscore,
                    outOf: '10',
                    link: metaMovieObj.url
                };

            });

        });
};

});

app.factory('rottenService', function($http, RT_API_KEY) {

    /**
    Retrieves a JSON object from Rotten Tomatoes.

    @param config {Object} Must have either the 'id' or 'query' key.
    @param config.id {string} RT movie id. For example, "770805418" is Inception.
    @param config.query {string} URL-friendly search query. For example, "incepti"...
    @param? config.limit {string || "1"} Number of movie results.

    @returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
    **/

    return function rottenService(config) {

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

app.factory('imdbService', function($http) {

    /**
    Retrieves a JSON object from IMDB.

    @param config {Object} Must have either the 'id' or 'query' key.
    @param config.id {string} IMDB movie id. For example, "tt1375666" is Inception.
    @param config.query {string} URL-friendly full movie title query. For example, "inception".

    @returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
    **/

    return function imdbService(config) {
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


app.factory('tmdbService', function($http, TMDB_API_KEY) {

    /**
    Retrieves a JSON object from TMDB.

    @param config {Object} Must have either the 'id' or 'query' key.
    @param config.id {string} IMDB movie id. For example, "tt1375666" is Inception.
    @param config.query {string} URL-friendly search query. For example, "incepti"...

    @returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
    **/

    return function tmdbService(config) {

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


app.factory('metacriticService', function($http, METACRITIC_API_KEY) {

    /**
    Retrieves a JSON object from Metacritic using mashape.

    @param config {Object} Must have the 'query' key.
    @param config.query {string} URL-friendly full movie search query. For example, "inception".
    @param? config.limit {string || "1"} Maximum search result pages to crawl. (Not sure what this means.)

    @returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
    **/

    return function metacriticService(config) {

        var data = {};
        data.max_pages = config.limit || '1';

        var url = 'https://byroredux-metacritic.p.mashape.com/search/movie';
        data.title = config.query;

        var headers = {"X-Mashape-Authorization": METACRITIC_API_KEY};

        return $http.post(url, data, {headers: headers});
    };

});



function imdbBackupCallback(json) {
    console.log("callback!!!!!!!!!!!!");
    console.log(json);
    return json;
}

app.factory('imdbBackupService', function($http) {

    /**
    Used only when the imdbService doesn't work. Retrieves a JSON object from IMDB.

    @param config {Object} Must have either the 'id' or 'query' key.
    @param config.id {string} IMDB movie id. For example, "tt1375666" is Inception.
    @param config.query {string} URL-friendly search query. For example, "inceptio"...
    @param config.year? {string} 4-digit year

    @returns {Promise} Follow up with 'success' or 'error'. Each function takes arguments: data, status, headers, config
    **/


    return function imdbBackupService(config) {
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
        }
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