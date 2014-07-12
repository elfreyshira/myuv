'use strict';

/**
Notes:

- use _.debounce for autocomplete stuff
- https://code.google.com/p/crypto-js/
- https://github.com/ded/script.js/


edge case searches:
FIXED: alien, taken: Metacritic year doesn't match somehow. perhaps use runtime instead.
FIXED: super size me: RT doesn't give the IMDB id. WHY?!
FIXED: castaway (1986): for tmdb, ratings exist, but it's 0 because nobody has rated it. check for # of ratings.
FIXED: incredibles: doesn't have imdb id. sigh, again.
FIXED?: twilight: the imdbid doesn't seem to exist on tmdb. i guess use a title search.
FIXED: amazing spider-man 2. user reviews didn't exist yet.
ama, doesn't show any results, just a blank title bar.

TODO: switch rating and source text position.

**/

require('angular');
require('ng-touch');
require('ng-animate');
require('ng-bootstrap');

require('firebase');
require('firebase-simple-login');
require('angularfire');

var angularModule = angular.module('myuv', [
        'ngAnimate',
        'ui.bootstrap',
        'ngTouch',
        'firebase'
]);

module.exports = angularModule;