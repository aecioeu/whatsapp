var gulp = require("gulp");
var plumber = require("gulp-plumber");
const terser = require("gulp-terser");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var minifyCSS = require("gulp-minify-css");
const cleanCSS = require("gulp-clean-css");
var htmlmin = require("gulp-htmlmin");
const javascriptObfuscator = require("gulp-javascript-obfuscator");
const purgecss = require("gulp-purgecss");
var ejs = require("gulp-ejs");

const config = require("./config.json");

// Minify e Concat Scripts
gulp.task("js", function () {
  return (
    gulp
      .src("./views/assets/input/js/*.js")
      //.pipe(plumber())
      //.pipe(terser())
      //.pipe(concat("*.ejs"))
      .pipe(
        javascriptObfuscator({
          compact: true,
        })
      )
      .pipe(
        rename({
          extname: ".ejs",
        })
      )
      .pipe(gulp.dest("./views/assets/output/js/"))
  );
});

// Minify e Concat Scripts
gulp.task("css", function () {
  return gulp
    .src("./views/assets/input/css/*.css")
    .pipe(minifyCSS())
    .pipe(concat("css.ejs"))
    .pipe(gulp.dest("./views/assets/output/css/"));
});

gulp.task("ejs", function () {
  /* return gulp
    .src("./views/*.ejs")
    .pipe(
      ejs(
        {
          videoId: config.videoId,
          comments: config.comments,
          total_comments: config.total_comments,
          headline: config.headline,
          headline2: config.headline2,
        },
        { ext: ".html" }
      )
    )
   .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("./public/html/"));*/
});

gulp.task("pages", function () {
  return gulp
    .src(["./public/html/*.html"])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest("./public/html/"));
});

// Watch
gulp.task("watch", function () {
  gulp.watch("./views/*.ejs", gulp.series("ejs"));
  gulp.watch("./views/**/*.ejs", gulp.series("ejs"));
  gulp.watch("./views/assets/input/css/*.css", gulp.series("css"));
  gulp.watch("./views/assets/input/js/*.js", gulp.series("js"));
});

// Default
gulp.task("default", gulp.series("watch"));
