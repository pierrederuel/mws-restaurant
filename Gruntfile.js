module.exports = function (grunt) {

    const server_port = 8000;
    // Project configuration.
    grunt.initConfig({
        clean: {
            folder: ['dist/'],
        },
        connect: {
            server: {
                options: {
                    livereload: true,
                    base: 'dist/',
                    port: server_port
                }
            }
        },
        watch: {
            static: {
                files: ['src/**/*.*'],
                tasks: ['build']
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [{
                            match: 'maps_api_key',
                            replacement: process.env.MAPS_API_KEY
                        },
                        {
                            match: "server_port",
                            replacement: server_port
                        }
                    ]
                },
                //replace the google maps key from the environment to the 2 html files that are using it
                files: [{
                    expand: true,
                    cwd: './dist',
                    src: ['./index.html', './restaurant.html', './js/dbhelper.js'],
                    dest: './dist'
                }]
            }
        },
        copy: {
            static: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/**',
                    dest: 'dist/'
                }]

            }
        }
    });

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Start web server
    grunt.registerTask('serve', [
        'build',
        'connect',
        'watch'
    ]);
    // Default task(s).
    grunt.registerTask('build', ['clean', 'copy:static', 'replace']);

};