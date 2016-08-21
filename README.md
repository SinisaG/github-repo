# github-repo

An example of using github API with simple angular based webapp

## Demo

You can see live demo [here](https://sinisag.github.io/github-repo/).

## Specs

Build a simple client-side app that lists GitHub repositories for a given user.

Use the GitHub API documented [here](https://developer.github.com/v3/).

The end-user will enter a Github user's name and see a list of repositories for that user including a link to the repos.

App needs to handle the following responses correctly:

* The Github user does not exist
* Github user has no repos
* Github API does not respond

We expect clear separation of responsibility and at least some unit-tests.

### Browser support

n -1, where n is current browser version

## Local setup

### Prerequisite

* [NodeJS (NPM)](https://nodejs.org/en/)
* [Bower](https://bower.io/)
* [grunt-cli](https://github.com/gruntjs/grunt-cli)

### Dependencies

Install app dependencies by running: 

```
$ bower install
$ npm install
```

### Run

`$ grunt serve`


### Test

`$ grunt test` or `npm test`

