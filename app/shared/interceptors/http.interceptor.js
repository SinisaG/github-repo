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
