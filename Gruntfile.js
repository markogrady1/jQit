module.exports = function(grunt) {
    grunt.initConfig({
       jshint: {
              all: ['Gruntfile.js', 'public/js/*.js']
       }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
};
