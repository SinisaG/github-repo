angular
    .module('GithubRepoApp.reposearch.controller', [
        'GithubRepoApp.services.githubmapper'
    ])
    .controller('repoSearchController', repoSearchController);

function repoSearchController(githubMapper) {
    var vm = this;
    vm.username = '';
    vm.onSearch = onSearch;
    vm.repos = [];
    vm.error = {
        display: false,
        message: ''
    };

    function onSearch() {
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
            }).catch(function (error) {
            vm.error.display = true;
            vm.error.message = error.message;
        });
    }
}
