$script([
    'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular.min.js',
    'https://rawgithub.com/lodash/lodash/2.2.0/dist/lodash.min.js'
    ], function() {
        $script('scripts/app.js', function() {
            $script(
                [
                    'scripts/services/getResultsWithTitle.js',
                    'scripts/services/httpImdbBackupService.js',
                    'scripts/services/httpImdbService.js',
                    'scripts/services/httpMetacriticService.js',
                    'scripts/services/httpRottenService.js',
                    'scripts/services/httpTmdbService.js'
                ], function() {
                    $script('scripts/controllers/MainController.js');
                });
        });
    });