module.exports = function (grunt) {

    const server_port = 8000;
    // Project configuration.
    grunt.initConfig({
        // Prepare dist folder
        clean: {
            dist: {
                folder: ['dist/'],
            }
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
                // Replace the google maps key
                // from the environment variables
                // replace the server port number from this config
                files: [{
                    expand: true,
                    cwd: './dist',
                    src: ['./index.html', './restaurant.html', './js/dbhelper.js'],
                    dest: './dist'
                }]
            }
        },
        // Copy static files except images
        copy: {
            static: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/**', '!**/img/**'],
                    dest: 'dist/'
                }]

            }
        },
        // Process images
        responsive_images: {
            large_high: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 1024,
                        suffix: 'x2',
                        quality: 80
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/*.{gif,jpg,png}'],
                    cwd: 'src/',
                    dest: 'dist/'
                }]
            },
            large_low: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 1024,
                        suffix: 'x1',
                        quality: 40
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/*.{gif,jpg,png}'],
                    cwd: 'src/',
                    dest: 'dist/'
                }]
            },
            small_high: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 560,
                        suffix: 'x2',
                        quality: 80
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/*.{gif,jpg,png}'],
                    cwd: 'src/',
                    dest: 'dist/'
                }]
            },
            small_low: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 560,
                        suffix: 'x1',
                        quality: 40
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/*.{gif,jpg,png}'],
                    cwd: 'src/',
                    dest: 'dist/'
                }]
            }
        },

        // Generate the images directory if it is missing
        mkdir: {
            images: {
                options: {
                    cwd: 'dist/',
                    create: ['img']
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-responsive-images');

    grunt.registerTask('optimize_images', [
        'mkdir:images',
        'responsive_images:large_high',
        'responsive_images:large_low',
        'responsive_images:small_high',
        'responsive_images:small_low'
    ]);
    grunt.registerTask('serve', ['build', 'connect', 'watch']);
    grunt.registerTask('build', ['clean:dist', 'copy:static', 'replace', 'optimize_images']);

};