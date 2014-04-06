/**
Notes:

- use _.debounce for autocomplete stuff
- https://code.google.com/p/crypto-js/
- https://github.com/ded/script.js/


edge case searches:
alien, taken: Metacritic year doesn't match somehow. perhaps use runtime instead.
super size me: RT doesn't give the IMDB id. WHY?!
castaway (1986): for tmdb, ratings exist, but it's 0 because nobody has rated it. check for # of ratings.

TODO: switch rating and source text position.

**/

require('angular');
require('ng-animate');
require('ng-bootstrap');

var myApp = angular.module('myuv', [
        'ngAnimate',
        'ui.bootstrap'
]);

myApp.constant('RT_API_KEY', 'f278acux2dr8vmmueege9bfv')
.constant('TMDB_API_KEY' ,'bb0d9620f620e8097998203a8af18aec')
.constant('METACRITIC_API_KEY' ,'iR4qVOE5vZSwTxgEfqalscz1ycR8G21K');
