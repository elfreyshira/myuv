'use strict';

var angularModule = require('../app');

function imdbDataIsBad(data) {
    return !parseFloat(data.imdbRating) || data.Response === "False";
}

angularModule.factory('getImdbById', function($q, httpImdbService) {

    return function getImdbById(imdbId) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {id: imdbId};

        httpImdbService(config).success(function(data) {

            if (imdbDataIsBad(data)) {
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

angularModule.factory('getImdbByTitle', function($q, httpImdbService) {

    return function getImdbByTitle(title, releaseYear) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {query: title};

        httpImdbService(config).success(function(data) {

            if (imdbDataIsBad(data) || data.Year !== releaseYear) {
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