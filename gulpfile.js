const { watch, dest, src, parallel, series } = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssDeclarationSorter = require('css-declaration-sorter');
const imgMin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();

function init() {
    return del('./dist/*');
}

function indexHtml() {
    return src('./dev/index.ejs')
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('./dist'));
}

function html() {
    del('./dist/pages/**/*.html');
    return src(['./dev/pages/*.ejs','!' + './dev/components/*.ejs'])
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('./dist/pages'));
}

function css() {
    const plugin = [
        autoprefixer(),
        cssDeclarationSorter({
            order: 'smacss'
        })
    ];
    del('./dist/css/**/*.css')
    return src('./dev/scss/*.scss')
    .pipe(sass({
        outputStyle: 'expanded'
    }))
    .pipe(postcss(plugin))
    .pipe(dest('./dist/css'));
}

function js() {
    del('./dist/js/**/*/js')
    return src('./dev/js/*.js')
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(dest('./dist/js'))
}

function img() {
    del('./dist/img/**/*')
    return src('./dev/img/*')
    .pipe(imgMin())
    .pipe(dest('./dist/img'))
}

function watcher() {
    watch('./dev/index.ejs', indexHtml);
    watch('./dev/**/*.ejs', html);
    watch('./dev/scss/*.scss', css);
    watch('./dev/js/*.js', js);
    watch('./dev/img', img);
    watch('./**/*.html', reload);
    watch('./dist/css/*.css', reload);
    watch('./dist/js/*.js', reload);
    watch('./dist/img', reload);
}

function serve(done) {
    browserSync.init({
        server: {
            baseDir: './dist',
            index: 'index.html'
        }
    });
    done();
    console.log('served');
}

function reload(done) {
    browserSync.reload();
    done();
}

exports.init = init;
exports.indexHtml = indexHtml;
exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.serve = serve;
exports.watcher = watcher;
exports.default = series(
    init,
    parallel(indexHtml, html, css, js, img),
    serve,
    watcher
);
