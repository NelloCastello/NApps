const {src, dest, series, parallel, watch} = require('gulp');
const scss          = require('gulp-sass')(require('sass'));
const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const ahex          = require('gulp-ahex');
const imagemin      = require('gulp-imagemin');
const del           = require('del');
const htmlmin       = require('gulp-htmlmin');
const typescript    = require('gulp-typescript');
const uglify        = require('gulp-uglify-es').default;

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
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(concat('style.min.css'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src('app/ts/**/*.ts')
        .pipe(typescript({
            noImplicitAny: true,
            removeComments: true,

            outFile: 'script.min.js'
        }))
        .pipe(uglify())
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



exports.default         = parallel(scripts, styles, browsersync, watching);
exports.build           = series(cleanDist, moveToDist, html, images);
exports.cleanDist       = cleanDist;