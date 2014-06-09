'use strict';

var angularModule = require('../app');
var _ = require('lodash');

angularModule.factory('getRottenData', function(readableTime) {
    return function getRottenData(movieObj) {

        var sources = [];
        if (movieObj.ratings.critics_score > 0) {
            sources.push({
                label: 'RT Critics',
                rating: movieObj.ratings.critics_score,
                outOf: '%',
                link: movieObj.links.alternate + '#contentReviews'
            });
        }
        if (movieObj.ratings.audience_score > 0) {
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
            year: movieObj.release_dates.theater ? movieObj.release_dates.theater.split('-')[0] : movieObj.year,
            rtId: movieObj.id,
            imdbId: movieObj.alternate_ids ? ('tt' + movieObj.alternate_ids.imdb) : undefined,
            runtime: readableTime(movieObj.runtime),
            mpaaRating: movieObj.mpaa_rating,
            sources: sources
        };

        return dataObj;
    };
});

angularModule.factory('getRottenById', function($q, httpRottenService, getRottenData) {

    return function getRottenById(rtId) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {id: rtId};

        httpRottenService(config).success(function(data) {

            if (data.error) {
                deferred.reject();
                return;
            }

            var dataObj = getRottenData(data);
            deferred.resolve(dataObj);
        });

        return promise;
    };
});

angularModule.factory('getRottenByTitle', function($q, httpRottenService, getRottenData) {

    return function getRottenByTitle(title) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {query: title};

        httpRottenService(config).success(function(data) {

            if (!data.total) {
                deferred.reject();
                return;
            }

            var dataObj = getRottenData(data.movies[0]);
            deferred.resolve(dataObj);
        });

        return promise;
    };
});


angular.module('myuv').factory('getRottenListByTitle', function($q, httpRottenService) {

    /** For autocomplete.
    [
        {
            title: 'Inception',
            year: '2010',
            id: '770805418'
        },
        {
            title: 'The Incredibles',
            year: '2004',
            id: '1337'
        },
        {
            title: 'Monsters, Inc.',
            year: '2001',
            id: '9999'
        }
    ]
    **/
    return function getRottenListByTitle(title) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {
            query: title,
            limit: 6
        };

        httpRottenService(config).success(function(data) {

            if (!data.total) {
                deferred.reject();
                return;
            }

            var movieList = _.reduce(data.movies, function(result, movieObj) {
                var obj = {
                    title: movieObj.title,
                    id: movieObj.id,
                    year: movieObj.release_dates.theater ? movieObj.release_dates.theater.split('-')[0] : movieObj.year
                };
                return result.concat(obj);
            }, []);

            deferred.resolve(movieList);
        });

        return promise;
    };
});