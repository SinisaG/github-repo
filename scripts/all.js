angular
    .module('GithubRepoApp', [
        'ui.router',
        'ngMaterial',
        'GithubRepoApp.home.controller',
        'GithubRepoApp.interceptors.http'
    ])
    .config(AppConfig);

function AppConfig($stateProvider, $mdThemingProvider, $httpProvider, $urlMatcherFactoryProvider) {

    //match routes with trailing slash
    $urlMatcherFactoryProvider
        .strictMode(false);

    //define theme palette
    $mdThemingProvider
        .theme('default')
        .primaryPalette('light-blue');

    //set up http interceptors (timeout)
    $httpProvider
        .interceptors
        .push('httpInterceptor');

    //define routes
    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'components/home/home.template.html',
            controller: 'homeController',
            controllerAs: 'vm',
            bindToController: true
        })

}



angular
    .module('GithubRepoApp.home.controller', [
        'GithubRepoApp.reposearch.directive'
    ])
    .controller('homeController', homeController);

function homeController() {
    var vm = this;
}

angular
    .module('GithubRepoApp.constants.config', [])
    .constant('CONFIG', {
        api: {
            timeout: 15000,
            errors: {
                network: 'Network issues',
                repoNotFound: 'This user has no repos.',
                userNotFound: 'User with this username does not exist.',
                generic: 'We experienced an unexpected error'
            },
            github: {
                base: 'https://api.github.com',
                headers: {
                    Accept: 'application/vnd.github.v3+json'
                },
                search: {
                    repos: '/users/:username/repos'
                }
            }
        }
    });

angular
    .module('GithubRepoApp.reposearch.controller', [
        'GithubRepoApp.services.githubmapper'
    ])
    .controller('repoSearchController', repoSearchController);

function repoSearchController (githubMapper) {
    var vm = this;
    vm.username = '';
    vm.onSearch = onSearch;
    vm.repos = [];
    vm.error = {
        display: false,
        message: ''
    };

    function onSearch () {
        //on input empty
        if (vm.username.length === 0) {
            vm.repos = [];
            vm.error.display = false;
            return;
        }
        githubMapper.getUserRepos(vm.username)
            .then(function (data) {
                vm.error.display = false;
                vm.repos = data;
            }).catch(function(error) {
                vm.error.display = true;
                vm.error.message = error.message;
        });
    }
}

angular
    .module('GithubRepoApp.reposearch.directive', [
        'GithubRepoApp.reposearch.controller'
    ])
    .directive('repoSearch', repoSearch);

function repoSearch() {
    return {
        restrict: 'A',
        templateUrl: 'shared/directives/repo-search/repo-search.template.html',
        scope: true,
        controller: 'repoSearchController',
        controllerAs: 'vm',
        bindToController: true
    };
}

angular
    .module('GithubRepoApp.interceptors.http', [
        'GithubRepoApp.constants.config'
    ])
    .service('httpInterceptor', httpInterceptor);

function httpInterceptor($q, CONFIG) {
    return {
        request: function (config) {
            config.timeout = CONFIG.api.timeout;
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === -1) {
                rejection.data = {
                    message: CONFIG.api.errors.network
                }
            }
            return $q.reject(rejection);
        }
    }
}

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
        }
    }
}
