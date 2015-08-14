'use strict';

// liveReloadで使う変数とか処理を定義
var
    LIVE_RELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({port: LIVE_RELOAD_PORT}),
    mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    }

// Gruntの内容を定義
module.exports = function(grunt) {

    // 必要なモジュール読み込み
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.initConfig({
        /*
        copy : {
            css : {
                files : [{expand:true, cwd:'css/', src:'*.min.css', dest:'sample/css/'}]
            },
            js : {
                files : [{expand:true, cwd:'js/', src:'*.min.js', dest:'sample/js/'}]
            }
        },
        */
        //コンパイル
        compass: {
            dev: {
                options: {
                    config: 'compass_config.rb',
                    environment: "development"
                },
                sourcemap: true
            },
            prod: {
                options: {
                    config: 'compass_config.rb',
                    environment: "production"
                },
                sourcemap: true
            }            
        },
        //ファイル監視
        watch: {
            options: {
                // このオプションを付けることで、liveReloadが出来ます
                livereload: LIVE_RELOAD_PORT
            },
            html: {
                files: ['./**/*.html']
            },
            css: {
                files: ['./**/*.css']
            },
            sass: {
                files: ['./**/*.scss'],
                tasks: ['compass:dev']
            }
        },
        // Uglify ファイル圧縮

        uglify: {
            minify: {
                dynamic_mappings: {
                // Gruntは"minify"タスクが実行さされると、lib/"配下で.js"を探し、
                // src-destのファイルマッピングをビルドするため、ファイルが追加・削除されても
                // Gruntfileを更新する必要はありません。
                    files: [
                        {
                            expand: true,     // 動的拡張機能を有効
                            cwd: '/',      // マッチするsrcはこのパスの相対
                            src: ['**/*.js'], // マッチする実際のパターン
                            dest: '/',   // 遷移先のパスの先頭部分
                            ext: '.min.js',   // 遷移先のファイルパスにつける拡張子
                        },
                    ],
                },
            },
        },


        // Concat ファイル結合
        /*
        concat: {
            dist: {
                src: [
                    'files/js/test1.js',
                    'files/js/test2.js',
                    'files/js/test3.js',
                    'files/js/test4.js'
                ],
                dest: 'files/js/<%= pkg.name %>.js'
            }
        },
        */
        //webサーバー
        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, './')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%=connect.options.port%>/list.html'
            }
        }
    });
    grunt.registerTask('default', ['connect:livereload', 'open', 'watch', 'compass']);
    grunt.registerTask('mini', ['uglify']);

};