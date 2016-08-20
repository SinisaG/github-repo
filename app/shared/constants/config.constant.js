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
