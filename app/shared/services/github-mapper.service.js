angular
    .module('GithubRepoApp.services.githubmapper', [
        'GithubRepoApp.constants.config'
    ])
    .service('githubMapper', githubMapper);

function githubMapper($http, $q, CONFIG) {

    var BASE_URL = CONFIG.api.github.base;
    var DEFAULT_HEADERS = CONFIG.api.github.headers;
    var ERRORS = CONFIG.api.errors;

    return {
        getUserRepos: getUserRepos
    };

    function getUserRepos(username) {
        var d = $q.defer();

        var searchRepo = CONFIG.api.github.search.repos;
        searchRepo = searchRepo.replace(':username', username);
        var url = BASE_URL + searchRepo;

        $http.get(url, {headers: DEFAULT_HEADERS})
            .success(
                function (data) {
                    if (data.length === 0) {
                        d.reject(
                            errorBuilder(ERRORS.repoNotFound)
                        );
                    } else {
                        d.resolve(data);
                    }
                })
            .catch(
                function (error) {
                    var errorMsg = error.data.message || ERRORS.generic;
                    if (error.status === 404) {
                        errorMsg = ERRORS.userNotFound;
                    }
                    d.reject(errorBuilder(errorMsg));
                });
        return d.promise;
    }

    function errorBuilder(msg) {
        return {
            message: msg
        };
    }
}
