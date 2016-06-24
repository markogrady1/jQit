module.exports = function(grunt) {
    grunt.initConfig({

       jshint: {
              all: {
              	src: [
	                'Gruntfile.js', 'public/js/*.js'
                ],
				options: {
					jshintrc: true
				}
              }
       }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
};
