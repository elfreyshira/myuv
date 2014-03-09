angular.module('myuv').controller('MainController',
    function($scope, httpRottenService, httpImdbService, httpTmdbService, httpMetacriticService, httpImdbBackupService,
        $window, getResultsWithTitle, getRottenByTitle, getImdbById, getTmdbById, getMetacriticByTitle) {

        $scope.movieSearchResults = [];

        $scope.hello = "hi";
        $scope.nothing = function() {


            var config = {
                query: $scope.query
                // id: 'tt1375666'
            };

            var title = $scope.query;

            getResultsWithTitle(title, $scope);

            // httpRottenService(config)
            // .success(function(data, status) {
            //     $scope.rt = data;
            // });

            // httpImdbService(config)
            // .success(function(data, status) {
            //     $scope.imdb = data;
            // });

            // httpTmdbService(config)
            // .success(function(data, status) {
            //     $scope.tmdb = data;
            // });

            // httpMetacriticService(config)
            // .success(function(data, status) {
            //     $scope.meta = data;
            // });

            // httpImdbBackupService(config)
            // .success(function(data, status) {
            //     console.log("success!!!!!!!!");
            //     $scope.imdb_backup = data;
            // });
            //

        };

        $scope.fetch = function() {

            // After getting rotten, get the other sources
            function getOtherSources(movieSearchResult) {

                var imdbId = movieSearchResult.imdbId;
                getImdbById(imdbId).then(function(data) {
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
                });

                getTmdbById(imdbId).then(function(data){
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
                });

                var title = movieSearchResult.title;
                var releaseDate = movieSearchResult.date;
                getMetacriticByTitle(title, releaseDate).then(function(data){
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);

                });

            }

            getRottenByTitle($scope.query).then(function(data) {

                var movieSearchResult = data;
                $scope.movieSearchResults.unshift(movieSearchResult);

                getOtherSources(movieSearchResult);

            });
        };

        $window.fetch = $scope.fetch;
        $window.show = function() {
            console.log(JSON.stringify($scope.movieSearchResults, null, 4));
        }

    });