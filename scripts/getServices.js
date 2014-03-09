angular.module('myuv').factory('getRottenByTitle', function($q, httpRottenService) {


    return function(title) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {query: title};

        httpRottenService(config).success(function(data) {

            if (!data.total) {
                deferred.resolve({});
                return;
            }

            var movieObj = data.movies[0];

            var sources = [
                {
                    label: 'RT Critics',
                    rating: movieObj.ratings.critics_score,
                    outOf: '%',
                    link: movieObj.links.alternate
                },
                {
                    label: 'RT Audience',
                    rating: movieObj.ratings.audience_score,
                    outOf: '%',
                    link: movieObj.links.alternate
                }
            ];

            // The object to return that contains only the important information
            var dataObj = {
                title: movieObj.title,
                date: movieObj.release_dates.theater,
                rtId: movieObj.id,
                imdbId: 'tt' + movieObj.alternate_ids.imdb,
                runtime: movieObj.runtime,
                mpaaRating: movieObj.mpaa_rating,
                sources: sources
            };

            deferred.resolve(dataObj);
        });

        return promise;

    };
});

angular.module('myuv').factory('getImdbById', function($q, httpImdbService) {
    return function(imdbId) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {id: imdbId};

        httpImdbService(config).success(function(data) {

            if (data.Response === "False") {
                deferred.resolve({});
                return;
            }

            var movieObj = data;

            var sources = [
                {
                    label: 'IMDB',
                    rating: parseFloat(movieObj.imdbRating),
                    outOf: '10',
                    link: 'http://www.imdb.com/title/' + imdbId
                }
            ];

            // The object to return that contains only the important information
            var dataObj = {
                sources: sources
            };

            deferred.resolve(dataObj);
        });

        return promise;

    };
});

angular.module('myuv').factory('getTmdbById', function($q, httpTmdbService) {
    return function(imdbId) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var config = {id: imdbId};

        httpTmdbService(config).success(function(data) {

            if (data.status_code === 6) {
                deferred.resolve({});
                return;
            }

            var movieObj = data;

            var sources = [
                {
                    label: 'TMDB',
                    outOf: '10',
                    link: 'http://www.themoviedb.org/movie/' + movieObj.id + '-' + movieObj.title.replace(/\W+/g,'-'),
                    rating: movieObj.vote_average
                }
            ];

            // The object to return that contains only the important information
            var dataObj = {
                sources: sources
            };

            deferred.resolve(dataObj);
        });

        return promise;

    };
});

angular.module('myuv').factory('getMetacriticByTitle', function($q, httpMetacriticService) {
    return function(title, releaseDate) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var urlFriendlyTitle = title.replace(/\W/g,'+');

        var config = {query: title};

        httpMetacriticService(config).success(function(data) {

            if (data.count < 1) {
                deferred.resolve({});
                return;
            }

            // Since we're searching by title and not an absolute id, we have to make sure we have the right movie
            // by ensuring that the release date is the same as the one given by RT
            var movieObjArray = _.where(data.results, {rlsdate: releaseDate});
            if (movieObjArray.length < 1) {
                deferred.resolve({});
                return;
            }
            var movieObj = movieObjArray[0];

            var sources = [
                {
                    label: 'Metacritics',
                    rating: parseInt(movieObj.score),
                    outOf: '100',
                    link: movieObj.url
                },
                {
                    label: 'Metacritic Users',
                    rating: parseFloat(movieObj.avguserscore),
                    outOf: '10',
                    link: movieObj.url
                }
            ];

            // The object to return that contains only the important information
            var dataObj = {
                sources: sources
            };

            deferred.resolve(dataObj);
        });

        return promise;

    };
});

