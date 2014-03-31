require('angular');
var _ = require('lodash');

angular.module('myuv').factory('getRottenByTitle', function($q, httpRottenService) {


    return function(title) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {query: title};

        httpRottenService(config).success(function(data) {

            if (!data.total) {
                deferred.reject();
                return;
            }

            var movieObj = data.movies[0];

            var sources = [
                {
                    label: 'RT Critics',
                    rating: movieObj.ratings.critics_score,
                    outOf: '%',
                    link: movieObj.links.alternate + '#contentReviews'
                },
                {
                    label: 'RT Audience',
                    rating: movieObj.ratings.audience_score,
                    outOf: '%',
                    link: movieObj.links.alternate + '#audience_reviews'
                }
            ];

            // The object to return that contains only the important information
            var dataObj = {
                title: movieObj.title,
                year: movieObj.year.toString(),
                rtId: movieObj.id,
                imdbId: movieObj.alternate_ids ? ('tt' + movieObj.alternate_ids.imdb) : undefined,
                runtime: movieObj.runtime,
                mpaaRating: movieObj.mpaa_rating,
                sources: sources
            };

            deferred.resolve(dataObj);
        });

        return promise;

    };
});

angular.module('myuv').factory('getImdbById', function($q, httpImdbService) {
    return function(imdbId) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {id: imdbId};

        httpImdbService(config).success(function(data) {

            if (data.Response === "False") {
                deferred.reject();
                return;
            }

            var sources = [
                {
                    label: 'IMDB',
                    rating: parseFloat(data.imdbRating),
                    outOf: '10',
                    link: 'http://www.imdb.com/title/' + imdbId
                }
            ];

            deferred.resolve({
                sources: sources
            });
        });

        return promise;

    };
});

angular.module('myuv').factory('getImdbByTitle', function($q, httpImdbService) {
    return function(title, releaseYear) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {query: title};

        httpImdbService(config).success(function(data) {

            if (data.Response === "False" || data.Year !== releaseYear) {
                deferred.reject();
                return;
            }

            var sources = [
                {
                    label: 'IMDB',
                    rating: parseFloat(data.imdbRating),
                    outOf: '10',
                    link: 'http://www.imdb.com/title/' + data.imdbID
                }
            ];

            deferred.resolve({
                sources: sources
            });
        });

        return promise;

    };
});

angular.module('myuv').factory('getTmdbById', function($q, httpTmdbService) {
    return function(imdbId) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {id: imdbId};

        httpTmdbService(config).success(function(data) {

            if (data.status_code === 6) {
                deferred.reject();
                return;
            }

            var sources = [
                {
                    label: 'TMDB',
                    outOf: '10',
                    link: 'http://www.themoviedb.org/movie/' + data.id + '-' + data.title.replace(/\W+/g,'-'),
                    rating: data.vote_average
                }
            ];

            deferred.resolve({
                sources: sources
            });
        });

        return promise;

    };
});

angular.module('myuv').factory('getMetacriticByTitle', function($q, httpMetacriticService) {
    return function(title, releaseYear) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var urlFriendlyTitle = title.replace(/\W/g,'+');

        var config = {query: title};

        httpMetacriticService(config).success(function(data) {

            if (data.count < 1) {
                deferred.reject();
                return;
            }

            // Since we're searching by title and not an absolute id, we have to make sure we have the right movie
            // by ensuring that the release date year is the same as the one given by RT
            var movieObjArray = _.filter(data.results, function(result) {
                return releaseYear === result.rlsdate.split('-')[0];
            });

            if (movieObjArray.length < 1) {
                deferred.reject();
                return;
            }
            var movieObj = movieObjArray[0];

            var sources = [
                {
                    label: 'Metacritics',
                    rating: parseInt(movieObj.score),
                    outOf: '100',
                    link: movieObj.url + '/critic-reviews'
                },
                {
                    label: 'Metacritic Users',
                    rating: parseFloat(movieObj.avguserscore),
                    outOf: '10',
                    link: movieObj.url + '/user-reviews'
                }
            ];

            deferred.resolve({
                sources: sources
            });
        });

        return promise;

    };
});

