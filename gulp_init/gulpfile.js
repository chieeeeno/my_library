'use strict';

var gulp = require('gulp');
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var uglify = require("gulp-uglify");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var jade = require('gulp-jade');
var cache = require('gulp-cached');
var grapher = require('sass-graph');
var gulpIf = require('gulp-if');
var forEach = require('gulp-foreach');
var minimist = require('minimist'); // CLI入力を解析
var stripDebug = require('gulp-strip-debug')    //console.logを削除

// gulp.task(“タスク名”,function() {});でタスクの登録をおこないます。
// gulp.src(“MiniMatchパターン”)で読み出したいファイルを指定します。
// pipe(行いたい処理)でsrcで取得したファイルに処理を施します
// gulp.dest(“出力先”)で出力先に処理を施したファイルを出力します。

// “sass/style.scss” sass/style.scssだけヒット
// “sass/*.scss” sassディレクトリ直下にあるscssがヒット
// “sass/**/*.scss” sassディレクトリ以下にあるすべてのscssがヒット
// [“sass/**/.scss”,"!sass/sample/**/*.scss] sass/sample以下にあるscssを除くsassディレクトリ以下のscssがヒット

var srcDir = "./src/";
var basedir = "./dest/";
var dir = srcDir;



/**
 * settings
 */
var knownOptions = {
  string: 'mode',
  default: { mode: process.env.NODE_ENV || 'dev' } // NODE_ENVに指定がなければ開発モードをデフォルトにする
};
// コマンドラインの入力を解析
var options = minimist(process.argv.slice(2), knownOptions),
    prodmode = (options.mode === 'prod') ? true : false
    dir  = prodmode ? basedir : srcDir;

console.log('[build env]', options.env, '[output in]', dir);



gulp.task("server", function() {
    browser({
        server: {
            baseDir: basedir
        }
    });
});

gulp.task("js", function() {
    gulp.src([srcDir + "/**/*.js", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
        .pipe(plumber())
        .pipe(gulpIf(prodmode,stripDebug()))
        .pipe(gulpIf(prodmode,uglify()))
        //.pipe(uglify())
        .pipe(gulp.dest(dir))
        .pipe(browser.reload({stream:true}));
});

gulp.task("sass", function() {
    var graph;
    //baseDir = "./source/";
    graph = grapher.parseDir(srcDir);
    gulp.src([srcDir + "/**/*.scss", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
        .pipe(plumber())
        .pipe(cache('sass'))
        .pipe(gulpIf(this.watching, forEach(function(currentStream, file) {
            var addParent, files;
            files = [file.path];
            addParent = function(childPath) {
                return graph.visitAncestors(childPath, function(parent) {
                    if (!_.includes(files, parent)) {
                        files.push(parent);
                    }
                    return addParent(parent);
                });
            };
            addParent(file.path);
            return gulp.src(files, {
                base: srcDir
            });
        })))
        .pipe(sass({
            style : 'expanded'  //出力形式の種類　#nested, compact, compressed, expanded.
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(dir))
        //.pipe(gulp.dest('./css'))
        .pipe(browser.reload({stream:true}));
    //console.log(dir);

    gulp.src([srcDir + "/**/*.css", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
        .pipe(gulp.dest(dir))
        .pipe(browser.reload({stream:true}));
});

gulp.task("html", function() {
    gulp.src([srcDir + "/**/*.html", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
        .pipe(gulp.dest(dir))
        .pipe(browser.reload({stream:true}));
});

gulp.task("img", function() {
    gulp.src([srcDir + "/**/img/**/*", "!"+srcDir + "/_copythis/**/*", "!"+srcDir + "/_partial/**/*"])
        .pipe(gulp.dest(dir))
        .pipe(browser.reload({stream:true}));
});



gulp.task("default", ['server'], function() {
    this.watching = true;
    //gulp.watch([srcDir + "/**/*.js", "!"+srcDir + "/**/min/**/*.js"], ["js"]);
    gulp.watch([srcDir + "/**/*.scss", "!"+srcDir + "/**/*.css"], ["sass"]);
    gulp.watch(srcDir + "/**/*.html", ["html"]);
    gulp.watch(srcDir + "/**/img/**/*", ["img"]);
});

gulp.task("build", ['js', 'sass', 'html', 'img']);