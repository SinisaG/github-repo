angular
    .module('GithubRepoApp.reposearch.directive', [
        'GithubRepoApp.reposearch.controller'
    ])
    .directive('repoSearch', repoSearch);

function repoSearch() {
    return {
        restrict: 'A',
        templateUrl: '/shared/directives/repo-search/repo-search.template.html',
        scope: true,
        controller: 'repoSearchController',
        controllerAs: 'vm',
        bindToController: true
    };
}
