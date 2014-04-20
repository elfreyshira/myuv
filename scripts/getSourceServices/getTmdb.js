'use strict';

require('angular');

angular.module('myuv').factory('getTmdbById', function($q, httpTmdbService) {

    return function getTmdbById(imdbId) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {id: imdbId};

        httpTmdbService(config).success(function(data) {

            if (data.status_code === 6 || !data.vote_count) {
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