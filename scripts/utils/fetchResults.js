'use strict';

var angularModule = require('../app');
var _ = require('lodash');

angularModule.factory('fetchResults', function(getRottenByTitle, getImdbById, getImdbByTitle,
    getTmdbById, getMetacriticByTitle, getRottenById, urlManager) {

    // After getting rotten, get the other sources
    function getOtherSources(movieSearchResult) {

        var imdbId = movieSearchResult.imdbId;
        var title = movieSearchResult.title;
        var releaseYear = movieSearchResult.year;
        var runtime = movieSearchResult.runtime;

        if (imdbId) {
            getImdbById(imdbId).then(function(data) {
                movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
            });

            getTmdbById(imdbId).then(function(data){
                movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
            });
        }
        else {
            getImdbByTitle(movieSearchResult.title, releaseYear).then(function(data) {
                movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);

                var imdbId = data.imdbId;
                getTmdbById(imdbId).then(function(data) {
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
                });
            });
        }

        getMetacriticByTitle(title, releaseYear, runtime).then(function(data){
            movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
        });

        return movieSearchResult;

    }

    /*

    Sets a hash query in the url correlating to a movie search.
    @param $scope {Object} the angular $scope from the controller
    @param queryObj {Object}
    @paramXOR queryObj.id {String}
    @paramXOR queryObj.q {String}
    @param resetInput {Function} resets the scope input box
    */
    return function fetchResults($scope, queryObj, resetInput) {
        urlManager.setMovieUrl(queryObj);

        var getRottenByQuery;
        if (queryObj.id) {
            getRottenByQuery = _.partial(getRottenById, queryObj.id);
        }
        else if (queryObj.q) {
            getRottenByQuery = _.partial(getRottenByTitle, queryObj.q);
        }
        else {
            return;
        }

        return getRottenByQuery().then(function(data) {
            resetInput();
            $scope.movieSearchResults.unshift(data);
            getOtherSources(data);
        });

    };

});
