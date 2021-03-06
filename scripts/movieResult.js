'use strict';

var angularModule = require('./app');
var _ = require('lodash');

angularModule.directive('movieResult', function() {

    return {
        scope: {
            movie: '='
        },
        link: function link(scope, element, attrs) {

            /**
            Returns a Foundation column offset depending on the length of the results,
            and only if it's the first column.

            @param {number} resultLength
            @param {boolean} $first
            @return {string}
            */
            scope.columnOffset = function(resultLength, $first) {
                return $first ? 'small-offset-' + (6 - resultLength) : '';
            };

            scope.showMoreInfo = false;
        },
        templateUrl: 'templates/movie-result.html'

    };

});

angularModule.directive('favorite', function(loginManager, favoritesManager) {

    return {
        scope: {
            rtId: '=',
            title: '='
        },
        link: function link(scope, element, attrs) {

            scope.saveAsFavorite = function() {
                var rottenTomatoesId = scope.rtId;
                var userFavorites = favoritesManager.getUserFavorites();

                if (!_.isEmpty(userFavorites)) {

                    if (!scope.isFavorited()) {
                        userFavorites.$add({
                            rtId: rottenTomatoesId,
                            title: scope.title
                        });
                    }
                    else {
                        var keyToRemove = _.findKey(
                            userFavorites,
                            function(favoriteObj, databaseKey) {
                                var rtIdOfFavorite = favoriteObj.rtId;
                                return rtIdOfFavorite === rottenTomatoesId;
                            }
                        );
                        userFavorites.$remove(keyToRemove);
                    }

                }
                else {
                    alert('You must be logged in to favorite movies. Sorry.');
                }
            };

            scope.isFavorited = function() {
                var userFavorites = favoritesManager.getUserFavorites();
                if (!_.isEmpty(userFavorites)) {
                    var favoritedKey = _.findKey(userFavorites, function(favoriteObj) {
                            return favoriteObj.rtId === scope.rtId;
                        });
                    return !_.isUndefined(favoritedKey);
                }
            };

        },
        replace: true,
        templateUrl: 'templates/favorite.html'

    };
});