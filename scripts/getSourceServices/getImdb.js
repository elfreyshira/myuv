'use strict';

require('angular');

angular.module('myuv').factory('getImdbById', function($q, httpImdbService) {

    return function getImdbById(imdbId) {
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

    return function getImdbByTitle(title, releaseYear) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {query: title};

        httpImdbService(config).success(function(data) {

            if (data.Response === "False" || data.Year !== releaseYear) {
                deferred.reject();
                return;
            }

            var imdbId = data.imdbID;

            var sources = [
                {
                    label: 'IMDB',
                    rating: parseFloat(data.imdbRating),
                    outOf: '10',
                    link: 'http://www.imdb.com/title/' + imdbId
                }
            ];

            deferred.resolve({
                sources: sources,
                imdbId: imdbId
            });
        });

        return promise;

    };
});