'use strict';

var angularModule = require('../app'),
    _ = require('lodash');

angularModule.factory('getMetacriticByTitle', function($q, httpMetacriticService) {

    return function getMetacriticByTitle(title, releaseYear, runtime) {
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
                return releaseYear === result.rlsdate.split('-')[0] || runtime === parseInt(result.runtime);
            });

            if (movieObjArray.length < 1) {
                deferred.reject();
                return;
            }
            var movieObj = movieObjArray[0];

            var sources = [];
            if (movieObj.score) {
                sources.push({
                    label: 'Metacritics',
                    rating: parseInt(movieObj.score),
                    outOf: '100',
                    link: movieObj.url + '/critic-reviews'
                });
            }
            if (movieObj.avguserscore) {
                sources.push({
                    label: 'Metacritic Users',
                    rating: parseFloat(movieObj.avguserscore),
                    outOf: '10',
                    link: movieObj.url + '/user-reviews'
                });
            }

            deferred.resolve({
                sources: sources
            });
        });

        return promise;

    };
});