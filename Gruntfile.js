module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: 'maps_api_key',
                        replacement: process.env.MAPS_API_KEY
                    }]
                },
                //replace the google maps key from the environment to the 2 html files that are using it
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['./index.html', './restaurant.html'],
                    dest: './dist'
                }]
            }
        },
        copy: {
            static: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '*',
                    dest: 'dist/'
                }]

            }
        }
    });

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy:static', 'replace']);

};