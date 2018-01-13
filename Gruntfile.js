module.exports = function (grunt) {

    const server_port = 8000;
    // Project configuration.
    grunt.initConfig({
        // Prepare dist folder
        connect: {
            server: {
                options: {
                    // livereload: true,
                    keepalive: true,
                    base: 'dist/',
                    port: server_port
                }
            }
        },

        // Process images
        responsive_images: {
            large_high: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 512,
                        suffix: '_2x',
                        quality: 60
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
                        width: 512,
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
                        width: 380,
                        suffix: '_2x',
                        quality: 60
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
                        width: 380,
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
            small_launcher: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 48,
                        height: 48,
                        suffix: '-icon-1x',
                        quality: 60
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/logo/*.{gif,jpg,png}'],
                    cwd: 'src/',
                    dest: 'dist/'
                }]
            },
            medium_launcher: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 96,
                        height: 96,
                        suffix: '-icon-2x',
                        quality: 60
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/logo/*.{gif,jpg,png}'],
                    cwd: 'src/',
                    dest: 'dist/'
                }]
            },
            large_launcher: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 192,
                        height: 192,
                        suffix: '-icon-4x',
                        quality: 60
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/logo/*.{gif,jpg,png}'],
                    cwd: 'src/',
                    dest: 'dist/'
                }]
            },
            xlarge_launcher: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 512,
                        height: 512,
                        suffix: '-icon-8x',
                        quality: 60
                    }]
                },
                files: [{
                    expand: true,
                    src: ['img/logo/*.{gif,jpg,png}'],
                    cwd: 'src/',
                    dest: 'dist/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-responsive-images');

    grunt.registerTask('optimize_images', [
        'responsive_images:large_high',
        'responsive_images:large_low',
        'responsive_images:small_high',
        'responsive_images:small_low',
        'responsive_images:small_launcher',
        'responsive_images:medium_launcher',
        'responsive_images:large_launcher',
        'responsive_images:xlarge_launcher',
    ]);
    grunt.registerTask('images', ['optimize_images'])
};