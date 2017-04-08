
  module.exports = function(grunt){

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		jshint:{
			// files:['Gruntfile.js','public/js/controller/*.js','public/js/config/*.js'],
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
                    'public/js/config/*.js',
                    'public/js/controller/*.js'
                ],
      			dest: 'public/js/index.js',
    		},
  		},

        watch: {
            js: {
                files: ['public/js/*/*.js','Gruntfile.js'],
                tasks: ['concat:js'],
            },
            html: {
                files: ['temp/*.html'],
                tasks:['concat:js']
            },
            css:{
                files:['public/stylesheet/*.css'],
                // tasks:['csslint']
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'public/',
                    src: ['**'],
                    dest: 'build/'
                },{
                    expand: true,
                    cwd: 'temp/',
                    src: ['**'],
                    dest: 'build'
                }]
            }
        },
        clean: ['build'],
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
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.registerTask('default',['connect','concat','watch']);

    
  };




