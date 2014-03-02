/**

app.controller('PageController'
app.factory('getResultsWithTitle'
app.factory('httpRottenService'
app.factory('httpImdbService'
app.factory('httpTmdbService'
app.factory('httpMetacriticService'
app.factory('httpImdbBackupService'


    **/
/**
Notes:

- use _.debounce for autocomplete stuff
- https://code.google.com/p/crypto-js/
- https://github.com/ded/script.js/
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
    function($scope, httpRottenService, httpImdbService, httpTmdbService, httpMetacriticService, httpImdbBackupService, $window, getResultsWithTitle) {

        $scope.movieSearchResults = [];

        $scope.hello = "hi";
        $scope.fetch = function(title) {

            var config = {
                query: title
                // id: 'tt1375666'
            };

            getResultsWithTitle(title, $scope);

            // httpRottenService(config)
            // .success(function(data, status) {
            //     $scope.rt = data;
            // });

            // httpImdbService(config)
            // .success(function(data, status) {
            //     $scope.imdb = data;
            // });

            // httpTmdbService(config)
            // .success(function(data, status) {
            //     $scope.tmdb = data;
            // });

            // httpMetacriticService(config)
            // .success(function(data, status) {
            //     $scope.meta = data;
            // });

            // httpImdbBackupService(config)
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
        sources: [
            {
                label: 'RT Critics',
                rating: 86,
                outOf: '%',
                link: 'http://www.rottentomatoes.com/m/inception/'
            },
            {
                label: 'RT Audience',
                rating: 91,
                outOf: '%',
                link: 'http://www.rottentomatoes.com/m/inception/'
            },
            {
                label: 'IMDB'
                rating: '8.8',
                outOf: '10',
                link: 'http://www.imdb.com/title/tt1375666/'
            },
            {
                label: 'TMDB',
                rating: '7.4',
                outOf: '10',
                link: 'http://www.themoviedb.org/movie/27205-inception'
            },
            {
                label: 'Metacritics'
                rating: '74',
                outOf: '100',
                link: 'http://www.metacritic.com/movie/inception'
            },
            {
                label: 'Metacritic Users'
                rating: '8.6',
                outOf: '10',
                link: 'http://www.metacritic.com/movie/inception'
            }
        ]
    },
    {movie1...},
    {movie2...}
]

@param title {string} Movie title.
@param scope {Object} The angular $scope.

@returns null
**/

app.factory('getResultsWithTitle', function($q, httpRottenService, httpImdbService, httpTmdbService, httpMetacriticService) {

    return function getResultsWithTitle(title, scope) {
        // _.find(movies, {searchKey:2})

        var resultObj = {
            searchKey: Date.now(),
            sources: []
        };

        httpRottenService({query: title})
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

            resultObj.sources.push(
                _.merge({}, rtDefaultObj,
                    {
                        label: 'RT Critics',
                        rating: rtMovieObj.ratings.critics_score
                    }
                )
            );

            resultObj.sources.push(
                _.merge({}, rtDefaultObj,
                    {
                        label: 'RT Audience',
                        rating: rtMovieObj.ratings.audience_score
                    }
                )
            );

            scope.movieSearchResults.unshift(resultObj);


            var imdbId = resultObj.imdbId;
            httpImdbService({id: imdbId})
            .success(function(data) {

                resultObj.sources.push({
                    label: 'IMDB',
                    outOf: '10',
                    link: 'http://www.imdb.com/title/' + imdbId,
                    rating: data.imdbRating
                });

            });

            httpTmdbService({id: imdbId})
            .success(function(data) {

                resultObj.sources.push({
                    label: 'TMDB',
                    outOf: '10',
                    link: 'http://www.themoviedb.org/movie/' + data.id + '-' + data.title.replace(/\W+/g,'-'),
                    rating: data.vote_average
                });

            });

            // TODO: Find the right movie out of the results. Use lodash or something.
            // fetch('batman begins') returns 'dark knight' as first result.
            httpMetacriticService({query: resultObj.title})
            .success(function(data) {

                var metaMovieObj = data.results[0];

                resultObj.sources.push({
                    label: 'Metacritics',
                    rating: metaMovieObj.score,
                    outOf: '100',
                    link: metaMovieObj.url
                });

                resultObj.sources.push({
                    label: 'Metacritic Users',
                    rating: metaMovieObj.avguserscore,
                    outOf: '10',
                    link: metaMovieObj.url
                });

            });

        });
    };

});
