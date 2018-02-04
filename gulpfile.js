const gulp = require('gulp')
    watch = require('gulp-watch')
    pug = require('gulp-pug')
    browserify = require('gulp-browserify')
    sass = require('gulp-sass')
    autoprefixer = require('gulp-autoprefixer')
    sourcemaps = require('gulp-sourcemaps')
    browserSync = require('browser-sync').create()
    plumberNotifier = require('gulp-plumber-notifier')
    reload = browserSync.reload

    py_files = '**/*.py'
    pug_files = 'templates/pages/**/*.pug'
    pug_watch_files = ['templates/**/*.pug', 'templates/pages/**/*.md'] 
    pug_dest = '.'

    js_files = 'static/es6/**/*.js'
    js_dest = 'static/js'

    sass_watch_files = ['static/sass/**/*.sass', 'static/sass/**/*.scss']
    sass_files = ['static/sass/main.sass']
    css_dest = 'static/css'

gulp.task('pug', function(){
    return gulp
    .src(pug_files)
    .pipe(plumberNotifier())
    .pipe(pug())
    .pipe(gulp.dest(pug_dest))
})

gulp.task('pug-watch', ['pug'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('js', function(){
    return gulp
    .src(js_files)
    .pipe(plumberNotifier())
    .pipe(browserify({debug: true}))
    .pipe(gulp.dest(js_dest))
})

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('sass', function(){
    return gulp
    .src(sass_files)
    .pipe(plumberNotifier())
    .pipe(sourcemaps.init())
    .pipe(sass({debug: true, outputStyle: 'compressed'}))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(css_dest))
    .pipe(browserSync.stream())
})

gulp.task('sass-watch', ['sass'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('browserSync', function(){
    browserSync.init(
        [js_files, pug_files, sass_files],
        {
            server: '.',
        }
        )
})


gulp.task('watch', ['pug', 'sass', 'js', 'browserSync'], function(){
    gulp.watch(sass_watch_files, ['sass-watch']);
    gulp.watch([pug_watch_files], ['pug-watch'])
    gulp.watch([js_files, sass_files, pug_files], reload)
    gulp.watch([js_files], ['js-watch'])
})

gulp.task('default', ['watch'])