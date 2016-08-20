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
        });

}
