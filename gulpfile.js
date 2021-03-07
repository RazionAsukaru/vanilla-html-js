const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browserify = require("gulp-browserify");
const browsersync = require("browser-sync").create();
const del = require("del");

// Sass Task
function scssTask() {
  return src("app/styles/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano]))
    .pipe(dest("dist/styles", { sourcemaps: "." }));
}

// Javascipt Task
function jsTask() {
  return src("app/js/*.js", { sourcemaps: true })
    .pipe(browserify({ debug: true }))
    .pipe(terser())
    .pipe(dest("dist/js", { sourcemaps: "." }));
}

// Browsersync Task
function browsersyncServer(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    ["app/scss/**/*.scss", "app/js/**/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}

exports.clean = () => del(["dist"]);

// Default Gulp Task
exports.default = series(scssTask, jsTask, browsersyncServer, watchTask);
