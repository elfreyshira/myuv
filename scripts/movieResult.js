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

angularModule.directive('favorite', function(loginManager) {

    var userFavorites;
    loginManager.qUserFavorites.then(function(favorites) {
        userFavorites = favorites;
    });

    return {
        scope: {
            rtId: '=favorite'
        },
        link: function link(scope, element, attrs) {

            scope.saveAsFavorite = function() {
                var rottenTomatoesId = scope.rtId;
                if (userFavorites) {
                    if (!scope.isFavorited()) {
                        userFavorites.$add(rottenTomatoesId);
                    }
                    else if (scope.isFavorited()) {
                        var keyToRemove = _.findKey(userFavorites, function(rtId, databaseKey){
                            return rtId === rottenTomatoesId;
                        });
                        userFavorites.$remove(keyToRemove);
                    }
                }
                else {
                    alert('You must be logged in to favorite movies. Sorry.');
                }
            };

            scope.isFavorited = function() {
                return _.contains(userFavorites, scope.rtId);
            };

        },
        replace: true,
        templateUrl: 'templates/favorite.html'

    };
});