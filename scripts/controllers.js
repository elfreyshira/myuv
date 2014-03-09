angular.module('myuv').controller('MainController',
    function($scope, httpRottenService, httpImdbService, httpTmdbService, httpMetacriticService, httpImdbBackupService,
        $window, getResultsWithTitle, getRotten) {

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

            getRotten({query: $scope.query}).then(function(data) {
                console.log('it is finished');
                console.log(data);
                $scope.movieSearchResults.unshift(data);
            });
        };

        $window.fetch = $scope.fetch;
        $window.show = function() {
            console.log(JSON.stringify($scope.movieSearchResults, null, 4));
        }

    });