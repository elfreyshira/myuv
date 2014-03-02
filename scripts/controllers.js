angular.module('myuv').controller('MainController',
    function($scope, httpRottenService, httpImdbService, httpTmdbService, httpMetacriticService, httpImdbBackupService, $window, getResultsWithTitle) {

        $scope.movieSearchResults = [];

        $scope.hello = "hi";
        $scope.fetch = function(title) {

            var config = {
                query: title
                // id: 'tt1375666'
            };

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

        $window.fetch = $scope.fetch;
        $window.show = function() {
            console.log(JSON.stringify($scope.movieSearchResults, null, 4));
        }

    });