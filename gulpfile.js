const {src, dest, series, parallel, watch} = require('gulp');
const scss          = require('gulp-sass')(require('sass'));
const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const ahex          = require('gulp-ahex');
const imagemin      = require('gulp-imagemin');
const del           = require('del');
const htmlmin       = require('gulp-htmlmin');
const uglify        = require('gulp-uglify-es').default;
const babel         = require('gulp-babel');
const ts            = require('gulp-typescript');
const browserify    = require('gulp-browserify');
const changed       = require('gulp-changed');

const tsProject = ts.createProject('tsconfig.json');



function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function images() {
    return src('app/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/images'))
}

function styles() {
    return src('app/scss/**/*.scss')
        .pipe(scss({
            outputStyle: 'compressed'
        }).on('error', scss.logError))
        .pipe(ahex())
        .pipe(concat('style.css'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src([
        "app/ts/**/*.ts"
    ])
        .pipe(tsProject())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(browserify({
        }))
        .pipe(concat('script.js'))
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/ts/**/*.ts'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

function moveToDist() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/script.min.js'
    ], {base: 'app'})
        .pipe(dest('dist'));
}

function html() {
    return src('app/*.html', {base: 'app'})
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest('dist'));
}

function cleanDist() {
    return del('dist');
}

exports.scripts         = scripts;

exports.default         = parallel(scripts, browsersync, watching);
exports.build           = series(cleanDist, moveToDist, html, images);
exports.cleanDist       = cleanDist;