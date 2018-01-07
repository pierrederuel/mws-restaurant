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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-responsive-images');

    grunt.registerTask('optimize_images', [
        'responsive_images:large_high',
        'responsive_images:large_low',
        'responsive_images:small_high',
        'responsive_images:small_low'
    ]);
    grunt.registerTask('gulp', ['optimize_images', 'connect'])
};