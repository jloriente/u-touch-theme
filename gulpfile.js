/**
 * Created by Sergey on 15.05.2017.
 */

/*===========GULP==============*/
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var coffee = require('gulp-coffee');


/*===========Compile SCSS==============*/

var sass = require('gulp-sass');

gulp.task('sass', function() {

    gulp.src('html/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('html/css'))

   /* gulp.src('html/sass/blocks/!*.scss')
        .pipe(sass())
        .pipe(gulp.dest('html/css'));
    
    gulp.src('html/sass/widgets/!*.scss')
        .pipe(sass())
        .pipe(gulp.dest('html/css'))*/

        .pipe(plumber())
        .pipe(sass({errLogToConsole: true}))
        .pipe(browserSync.reload({
            stream: true
        }))

});


/*===========Watch==============*/


gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('html/sass/**/*.scss', ['sass']);
    gulp.watch('html/*.html', browserSync.reload);
    gulp.watch('html/js/**/*.js', browserSync.reload);

    // others
});


/*===========ON-Line synchronization from browsers==============*/

var browserSync = require('browser-sync');

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'html'
        }
    })
});


/*===========Join files==============*/


var useref = require('gulp-useref');

gulp.task('useref', function(){
    var assets = useref.assets();

    return gulp.src('html/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});


var uglify = require('gulp-uglify');

gulp.task('useref', function(){
    var assets = useref.assets();

    return gulp.src('html/*.html')
        .pipe(assets)
        .pipe(uglify())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});



/*===========Join files for CSS==============*/


var gulpIf = require('gulp-if');

gulp.task('useref', function(){
    var assets = useref.assets();

    return gulp.src('html/*.html')
        .pipe(assets)
        .pipe(gulpIf('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});


/*===========Minify CSS==============*/

var minifyCSS = require('gulp-minify-css');

gulp.task('useref', function(){
    var assets = useref.assets();

    return gulp.src('html/*.html')
        .pipe(assets)
        .pipe(gulpIf('*.css', minifyCSS()))
        // Uglifies only if it's a Javascript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});


/*===========Minimization IMAGE==============*/


var imagemin = require('gulp-imagemin');

gulp.task('images', function(){
    return gulp.src('html/img/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});

var cache = require('gulp-cache');

gulp.task('images', function(){
    return gulp.src('html/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'))
});


gulp.task('compress', function() {
    gulp.src('html/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});


/*=============Copy Fonts==============*/

gulp.task('fonts', function() {
    return gulp.src('html/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});


/*=============Auto-deleting temporary files==============*/

var del = require('del');

gulp.task('clean:dist', function(callback){
    del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});


gulp.task('clean', function(callback) {
    del('dist');
    return cache.clearAll(callback);
});


/*=============Join tasks==============*/

var runSequence = require('run-sequence');

gulp.task('default', function(callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
});