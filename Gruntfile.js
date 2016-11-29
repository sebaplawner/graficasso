module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'www/css/index.css': 'www/sass/index.sass'
                }
            }
        },
        exec: {
            prepare: {
                command:"cordova prepare",
                stdout:true,
                stderror:true
            }
        },
        watch: {
            files:['www/**/*.*'],
            tasks:['sass', 'exec:prepare'],
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['watch']);

};