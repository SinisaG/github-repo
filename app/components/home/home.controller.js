angular
    .module('GithubRepoApp.home.controller', [
        'GithubRepoApp.reposearch.directive'
    ])
    .controller('homeController', homeController);

function homeController() {
    var vm = this;
}
