const {src, dest, series, parallel, watch} = require('gulp');
const scss          = require('gulp-sass')(require('sass'));
const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const ahex          = require('gulp-ahex');
const imagemin      = require('gulp-imagemin');

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

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/*.html']).on('change', browserSync.reload);
}

function build() {
    
}


exports.browsersync     = browsersync;
exports.watching        = watching;
exports.styles          = styles;

exports.default         = parallel(browsersync, watching);