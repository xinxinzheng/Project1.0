
  module.exports = function(grunt){

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		jshint:{
			files:['Gruntfile.js','js/*.js'],
		},

		csslint:{
			options:{},
			files:['stylesheet/*.css'],
		},
		
        concat: {
            options: {
                process: function(src, filepath) {
                    if (filepath.substr(filepath.length - 2) === 'js') {
                        return '// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    } else {
                        return src;
                    }
                }
            },
    		js: {
      			src: [
                    'js/config/*.js',
                    'js/controller/*.js'
                ],
      			dest: 'js/index.js',
    		},
  		},

        watch: {
            js: {
                files: ['js/*/*.js','Gruntfile.js'],
                tasks: ['concat:js','jshint'],
            },
            html: {
                files: ['temp/*.html'],
            },
        },

  		connect: {
            dev: {
                options: {
                    port: 8081,
                    base: ['public','temp']
                }
            },
        },
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default',['connect','concat','watch']);

    
  };




