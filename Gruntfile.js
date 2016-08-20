module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    connect: {
      app: {
        options: {
          port: 9000,
          base: {
            path: 'dist'
          },
          open: true
        }
      }
    },
    copy: {
      templates: {
        src: '**/*.html',
        dest: 'dist/',
        cwd: 'app',
        expand: true
      },
      assets: {
        src: ['assets/images/**', '!assets/stylesheet/**'],
        dest: 'dist/',
        cwd: '.',
        expand: true
      }
    },
    concat: {
      js: {
        src: ['app/**/*.js', '!app/**/*.spec.js'],
        dest: 'dist/scripts/all.js'
      }
    },
    jscs: {
      files: {
        src: [
          'app/**/**.js'
        ]
      },
      options: {
        config: ".jscsrc",
        force: true
      }
    },
    useminPrepare: {
      html: 'dist/index.html',
      options: {
        dest: 'dist/',
        root: '',
        flow: {
          steps: {
            js: ['concat'],
            css: ['concat']
          }
        }
      }
    },
    usemin: {
      html: ['dist/index.html']
    },
    wiredep: {
      bower: {
        src: 'app/index.html'
      }
    },
    less: {
      app: {
        files: {
          'dist/css/all.css': 'assets/stylesheet/main.less'
        }
      }
    },
    watch: {
      options: {
        livereload: true,
        debounceDelay: 500
      },
      scripts: {
        files: 'app/**/*.js',
        tasks: ['concat:js']
      },
      html: {
        files: 'app/**/*.html',
        tasks: ['build']
      },
      less: {
        files: ['assets/stylesheet/**/*.less', 'app/**/*.less'],
        tasks: ['less_imports:app', 'less:app']
      }
    },
    less_imports: {
      app: {
        files: {
          'assets/stylesheet/imports.less': ['app/**/*.less']
        }
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.config.js'
      }
    }
  });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.registerTask('build', [
    'wiredep',
    'less_imports:app',
    'copy:templates',
    'copy:assets',
    'less:app',
    'useminPrepare',
    'concat:generated',
    'concat:js',
    'usemin'
  ]);

  grunt.registerTask('serve', [
    'build',
    'connect:app',
    'watch'
  ]);

  grunt.registerTask('test', [
    'karma:unit'
  ]);
};
