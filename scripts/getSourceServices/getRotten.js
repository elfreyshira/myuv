'use strict';

require('angular');

angular.module('myuv').factory('getRottenByTitle', function($q, httpRottenService) {

    return function getRottenByTitle(title) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {query: title};

        httpRottenService(config).success(function(data) {

            if (!data.total) {
                deferred.reject();
                return;
            }

            var movieObj = data.movies[0];

            var sources = [];
            if (movieObj.ratings.critics_score >= 0) {
                sources.push({
                    label: 'RT Critics',
                    rating: movieObj.ratings.critics_score,
                    outOf: '%',
                    link: movieObj.links.alternate + '#contentReviews'
                });
            }
            if (movieObj.ratings.audience_score >= 0) {
                sources.push({
                    label: 'RT Audience',
                    rating: movieObj.ratings.audience_score,
                    outOf: '%',
                    link: movieObj.links.alternate + '#audience_reviews'
                });
            }

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
