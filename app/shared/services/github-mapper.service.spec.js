(function () {
    'use strict';

    var githubMapper;
    var $httpBackend;
    var CONFIG;
    var fetchUrl;
    var $timeout;

    describe('github service', function () {

        beforeEach(function () {
            module('GithubRepoApp.services.githubmapper');
            module('GithubRepoApp.constants.config');
            var jsonFixtures = jasmine.getJSONFixtures();
            jsonFixtures.fixturesPath = 'base/test/fixtures';
        });

        beforeEach(inject(function ($injector, _CONFIG_, _githubMapper_) {
            githubMapper = _githubMapper_;
            CONFIG = _CONFIG_;
            $httpBackend = $injector.get('$httpBackend');
            $timeout = $injector.get('$timeout');
            fetchUrl = CONFIG.api.github.base +
                CONFIG.api.github.search.repos.replace(':username', 'sinisag');
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('repos search', function () {
            it("should return list of user's repos", inject(function () {
                var repoListMock = getJSONFixture('github-user-repos-response.json');
                $httpBackend.expectGET(fetchUrl).respond(repoListMock);
                githubMapper.getUserRepos('sinisag').then(
                    function (repos) {
                        expect(repos).toBeDefined();
                        expect(repos.length).toBeGreaterThan(0);
                    });
                $httpBackend.flush();
            }));

            it("should handle user not found error (404)", inject(function () {
                $httpBackend.expectGET(fetchUrl).respond(404, 'Not found');
                githubMapper.getUserRepos('sinisag').catch(
                    function (error) {
                        expect(error).toBeDefined();
                        expect(error.message).toEqual(CONFIG.api.errors.userNotFound);
                    }
                );
                $httpBackend.flush();
            }));

            it("should handle no repos", inject(function () {
                $httpBackend.expectGET(fetchUrl).respond(200, []);
                githubMapper.getUserRepos('sinisag').catch(
                    function (error) {
                        expect(error).toBeDefined();
                        expect(error.message).toEqual(CONFIG.api.errors.repoNotFound);
                    }
                );
                $httpBackend.flush();
            }));

            it("should handle any error and propagate the message", inject(function () {
                $httpBackend.expectGET(fetchUrl).respond(503, {message: 'Forbidden'});
                githubMapper.getUserRepos('sinisag').catch(
                    function (error) {
                        expect(error).toBeDefined();
                        expect(error.message).toEqual('Forbidden');
                    }
                );
                $httpBackend.flush();
            }));

            it("should handle errors without the message", inject(function () {
                $httpBackend.expectGET(fetchUrl).respond(500, {});
                githubMapper.getUserRepos('sinisag').catch(
                    function (error) {
                        expect(error).toBeDefined();
                        expect(error.message).toEqual(CONFIG.api.errors.generic);
                    }
                );
                $httpBackend.flush();
            }));
        })
    });
})();
