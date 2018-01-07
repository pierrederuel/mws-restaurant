module.exports = function (grunt) {

    const db_server_port = 1337;
    const server_port = 8000;
    // Project configuration.
    grunt.initConfig({
        // Prepare dist folder
        clean: {
            all: ['dist'],
            static: {
                src: ['dist/*', '!dist/img']
            }
        },
        connect: {
            server: {
                options: {
                    livereload: true,
                    keepalive: true,
                    base: 'dist/',
                    port: server_port
                }
            }
        },
        watch: {
            static: {
                files: ['src/**/*.*', '!**/scss/**'],
                tasks: ['build:static']
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: 'maps_api_key',
                        replacement: process.env.MAPS_API_KEY || ""
                    }]
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
                    src: ['**/**', '!**/img/**', '!**/scss/**'],
                    dest: 'dist/'
                }]

            },
            html: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.html'],
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
                        suffix: '_2x',
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
                        suffix: '_1x',
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
                        suffix: '_2x',
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
                        suffix: '_1x',
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
                    create: ['dist/img']
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
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('serve', ['build', 'connect', 'watch']);
    grunt.registerTask('build:static', ['clean:static', 'copy:static', 'replace'])
    grunt.registerTask('build', ['clean:all', 'build:static', 'optimize_images']);

    grunt.registerTask('gulp', ['copy:html', 'replace', 'optimize_images', 'connect'])
};