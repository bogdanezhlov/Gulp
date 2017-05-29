const gulp = require('gulp');
const del = require('del');
// const if = require('gulp-if');
// reset.css
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const postcss = require('gulp-postcss');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const eslint = require('gulp-eslint');
const stylelint = require('stylelint'); // gulp-stylelint???
const postCssFontMagician = require('postcss-font-magician');
const cssnano = require('gulp-cssnano');
const postcssAssets = require('postcss-assets');
const postcssReporter = require('postcss-reporter');
const postcssBrowserReporter = require('postcss-browser-reporter');
const htmlhint = require("gulp-htmlhint");
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
// const pump = require('pump');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const sourcemaps = require('gulp-sourcemaps');
const useref = require('gulp-useref');
// const rigger = require('gulp-rigger');
const postcssPropertyLookup = require('postcss-property-lookup');
const babel = require('gulp-babel');
const postcssZindex = require("postcss-zindex");


// gulp.task('server', function() {
//     browserSync({
//         server: {
//             baseDir: './build'
//         },
//         host: 'localhost',
//         port: 2241
//     })
// });









gulp.task('clean', () => {
    return del('build')
});

gulp.task('assets', () => {
    return gulp.src('./src/img/**')
        .pipe(gulp.dest('./build/img'))
})
// gulp.task('default', () => {
//     return gulp.src('.src/js/**/*.js')
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(gulp.dest('dist'));
// });

// gulp.task('build:dev', () => {
//     gulp.watch('./src/style/**/*.scss', ['css']);
//     gulp.watch('./src/**/*.html', ['htmlbuild']);
//     gulp.watch('./build/*.html', ['htmlhint']);
//     gulp.watch('./src/js/*.js', ['babel']);
//     // gulp.watch('./src/js/**/*.js' ['eslint']);
// })
// gulp.task('build:dev', () => {
//     gulp.task('./src/style/**/*.scss', ['css']);
//     gulp.task('./src/**/*.html', ['htmlbuild']);
//     gulp.task('./build/*.html', ['htmlhint']);
//     gulp.task('./src/js/*.js', ['babel']);
//     // gulp.watch('./src/js/**/*.js' ['eslint']);
// })
gulp.task('build', ['pretask1', 'pre_task_2'], function() {
  console.log('task_1 is done');
});

gulp.task('build:dev', ['clean', 'assets', 'css', 'htmlbuild', 'htmlhint', 'babel']);

// gulp.task('build:dev', function() {
//     return runSequence(
//         'clean',
//         ['assets', 'css', 'htmlbuild', 'babel'],
//         'htmlhint'
//     );
// });

// html build
// gulp.task('htmlbuild', () => {
//     return gulp.src('./src/*.html')
//         .pipe(useref())
//         // .pipe(rigger())
//         // .pipe(rename({
//         //     suffix: '.full'
//         // }))
//         .pipe(gulp.dest('./build'))
// });



// LINTER
// linter html
gulp.task('htmlhint', () => {
    return gulp.src("./build/*.html")
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
});
// linter js
gulp.task('eslint', () => {
    return gulp.src('./build/js/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
    // .on('error', notify.onError({
    // message: 'There is a JS error, please look the console for details'
    // }));
});


gulp.task('css', function(done) {
    var processors = [
        postcssFlexbugsFixes(),
        stylelint(),
        postcssAssets({
            loadPaths: ["./build/img/"],
            relativeTo: "./style/main.css"
        }),
        precss(),
        postcssZindex(),
        autoprefixer(),
        postCssFontMagician({
            protocol: 'https:'
        }),
        postcssBrowserReporter(),
        postcssReporter()
    ];
    return gulp.src('./src/style/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .on('error', done)
        .pipe(rename('main.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/style'))
});



// MINIFY
// minify images
gulp.task('imgmin', () => {
    return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
});
// minify css
gulp.task('cssnano', () => {
    return gulp.src('./src/style/main.css')
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./build/style'))
});
// minify html
gulp.task('htmlmin', () => {
    return gulp.src('./src/*full.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./build'));
});
// minify js
gulp.task('jsmin', (cb) => {
    pump([
            gulp.src('./build/js/**/*.js'),
            uglify(),
            rename({
                suffix: '.min'
            }),
            gulp.dest('./build/js')
        ],
        cb
    );
});
// minify all
gulp.task('min:all', ['htmlmin', 'cssnano', 'imgmin', 'jsmin']);

// ese6 => es5
gulp.task('babel', () => {
    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./build/js'))
})
// gulp.src('./src/js/**/*.js'),
//     babel({
//         presets: ['es2015']
//     });




// linter+compiler
// gulp.task('default', function() {
//     gulp.watch('./build/style/**/*.scss', ['css']);
//     gulp.watch('./build/*.html', ['htmlhint']);
// gulp.watch('./src/js/**/*.js' ['eslint']);
// })
