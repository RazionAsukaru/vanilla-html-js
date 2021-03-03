const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browserify = require('gulp-browserify');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
    return src('app/scss/style.scss', {sourcemaps: true})
        .pipe(sass())
        .pipe(postcss([cssnano]))
        .pipe(dest('dist/css', {sourcemaps: '.'}));
}

// Javascipt Task
function jsTask() {
    return src('app/js/*.js', {sourcemaps: true})
        .pipe(browserify({ debug: true }))
        .pipe(terser())
        .pipe(dest('dist', {sourcemaps: '.'}));
}

// Browsersync Task
function browsersyncServer(cb) {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch('*.html', browsersyncReload);
    watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp Task
exports.default = series(
    scssTask,
    jsTask,
    browsersyncServer,
    watchTask
);
