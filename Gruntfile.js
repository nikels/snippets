module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    watch: {
      grunt: {
        files: 'Gruntfile.js'
        , tasks: [
          'handlebars'
          , 'concat'
        ]
        , options: {
          livereload: true
        }
      }
      , public: {
        files: 'public/**/*.*'
        , options: {
          livereload: true
        }
      }
      , js: {
        files: 'src/js/**/*.js'
        , tasks: [
          'concat:js'
        ]
      }
      , css: {
        files: 'src/css/**/*.css'
        , tasks: [
          'concat:css'
        ]
      }
      , templates: {
        files: 'src/templates/**/*'
        , tasks: [
          'handlebars'
          , 'concat:js'
        ]
      }
    }

    , concat: {
      css: {
        src: [
          'src/css/*.css'
        ]
        , dest: 'public/css/app.css' }
      , js: {
        options: {
          separator: ';'
        }
        , src: [
          'src/js/jquery.js'
          , 'src/js/bootstrap.js'
          , 'src/js/handlebars.js'
          , 'src/js/handlebars.templates.js'
          , 'src/js/lodash.js'
          , 'src/js/backbone.js'
          , 'src/js/shCore.js'
          , 'src/js/shBrushJScript.js'
          , 'src/js/momentjs/moment.js'
          , 'src/js/cookies.js'
          , 'src/js/views/**.js'
          , 'src/js/app.js'
        ]
        , dest: 'public/js/libs.js'
      }
    }

    , handlebars: {
      compile: {
        options: {
          processName: function(filename) {
            var lowerCased = filename.toLowerCase();
            var pathRegExp = /^src\/templates.(.*).hbs$/i;
            var nameRegExp = /\//g;
            var name = lowerCased.replace(pathRegExp, "$1");
            var path = name.replace(nameRegExp, "");
            grunt.log.write(name, path);
            return path;
          }
        },
        files: {
          "src/js/handlebars.templates.js": [
            "src/templates/**/*.hbs"
          ]
        }
      }
    }

    , nodemon: {
      dev: {
        options: {
          file: 'app.js',
          ignoredFiles: ['node_modules/**'],
          env: {
            PORT: '3000'
          }
        }
      }
    }

    , concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  // Default task(s).
  //grunt.registerTask('default', ['concurrent:dev']);
  grunt.registerTask('con', ['concurrent']);

  grunt.registerTask('app', ['nodemon']);

  grunt.registerTask('default', [
    'handlebars'
    , 'concat'
    , 'watch'
  ]);
};
