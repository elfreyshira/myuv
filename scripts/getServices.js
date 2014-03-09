angular.module('myuv').factory('getRotten', function($q, httpRottenService) {


    return function(config) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        console.log('calling getRotten');

        httpRottenService(config).then(function(httpObj) {

            if (!httpObj.data.total) {
                deferred.resolve({});
                return;
            }

            var movieObj = httpObj.data.movies[0];

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