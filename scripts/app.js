/**

app.controller('PageController'
app.factory('getResultsWithTitle'
app.factory('httpRottenService'
app.factory('httpImdbService'
app.factory('httpTmdbService'
app.factory('httpMetacriticService'
app.factory('httpImdbBackupService'


    **/
/**
Notes:

- use _.debounce for autocomplete stuff
- https://code.google.com/p/crypto-js/
- https://github.com/ded/script.js/
**/


var myApp = angular.module('myuv', ['ngAnimate', 'ui.bootstrap']);
myApp.constant('RT_API_KEY', 'f278acux2dr8vmmueege9bfv')
.constant('TMDB_API_KEY' ,'bb0d9620f620e8097998203a8af18aec')
.constant('METACRITIC_API_KEY' ,'iR4qVOE5vZSwTxgEfqalscz1ycR8G21K');

myApp.run(function($httpBackend) {
    
});