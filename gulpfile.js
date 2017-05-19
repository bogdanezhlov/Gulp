const gulp = require('gulp');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
// const eslint = require('gulp-eslint');
const stylelint = require('stylelint');
const postCssFontMagician = require('postcss-font-magician');
const cssnano = require('gulp-cssnano');
const postcssAssets = require('postcss-assets');
const postcssReporter = require('postcss-reporter');
const postcssBrowserReporter = require('postcss-browser-reporter');
const htmlhint = require("gulp-htmlhint");
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const pump = require('pump');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
// const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const postcssPropertyLookup = require('postcss-property-lookup');
const babel = require('gulp-babel');



// gulp.task('default', () => {
//     return gulp.src('.src/js/**/*.js')
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(gulp.dest('dist'));
// });





gulp.task('jsmin', function (cb) {
  pump([
        gulp.src('./src/js/**/*.js'),
        babel({
            presets: ['es2015']
        }),
        uglify(),
        rename({
            suffix: '.min'
        }),
        gulp.dest('./build/js')
    ],
    cb
  );
});




// html build
gulp.task('htmlbuild', function() {
    gulp.src('./src/*.html')
        .pipe(rigger())
        .pipe(rename({
            suffix: '.full'
        }))
        .pipe(gulp.dest('./src'))
});



// LINTER
// linter html
gulp.task('htmlhint', function() {
    gulp.src("./src/*.html")
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
});
// linter js
// gulp.task('eslint', () => {
//    gulp.src('./src/js/*.js')
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError())
//     // .on('error', notify.onError({
//         // message: 'There is a JS error, please look the console for details'
//     // }));
// });


gulp.task('css', function(done) {
    var processors = [
        postcssFlexbugsFixes(),
        stylelint(),
        postcssAssets({
            loadPaths: ["./build/img/"],
            relativeTo: "./style/main.css"
        }),
        precss(),
        autoprefixer(),
        postCssFontMagician({
            protocol: 'https:'
        }),
        postcssBrowserReporter(),
        postcssReporter()
    ];
    return gulp.src('./src/style/**/*.scss')
        .pipe(postcss(processors))
        .on('error', done)
        .pipe(rename('main.css'))
        .pipe(gulp.dest('./src/style'))
});



// MINIFY
// minify images
gulp.task('imgmin', () =>
    gulp.src('./src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img'))
);
// minify css
gulp.task('cssnano', function() {
    return gulp.src('./src/style/main.css')
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./build/style'))
});
// minify html
gulp.task('htmlmin', function() {
    return gulp.src('./src/*full.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./build'));
});
// minify all
gulp.task('build', ['htmlmin', 'cssnano', 'imgmin']);



// linter+compiler
gulp.task('default', function() {
    gulp.watch('./src/style/**/*.scss', ['css']);
    gulp.watch('./src/*.html', ['htmlhint']);
    // gulp.watch('./src/js/**/*.js' ['eslint']);
})
