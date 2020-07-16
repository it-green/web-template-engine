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

function html() {
    return src(['./dev/**/*.ejs','!' + './dev/components/*.ejs'])
    .pipe(ejs({ title: 'gulp-ejs' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('./dist'))
}

function init() {
    return del('./dist');
}

function css() {
    const plugin = [
        autoprefixer(),
        cssDeclarationSorter({
            order: 'smacss'
        })
    ];
    return src('./dev/scss/*.scss')
    .pipe(sass({
        outputStyle: 'expanded'
    }))
    .pipe(postcss(plugin))
    .pipe(dest('./dist/css'));
}

function js() {
    return src('./dev/js/*.js')
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(dest('./dist/js'))
}

function img() {
    return src('./dev/img/*')
    .pipe(imgMin())
    .pipe(dest('./dist/img'))
}

function watcher() {
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

exports.ejs = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.serve = serve;
exports.watcher = watcher;
exports.init = init;
exports.default = series(
    init,
    parallel(html, css, js, img),
    serve,
    watcher
);
