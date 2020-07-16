const { watch, dest, src, parallel } = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

function html() {
    return src(['./dev/pages/*.ejs', '!' + './dev/pages/components/*.ejs'])
    .pipe(ejs({ title: 'gulp-ejs' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('./dist/html'))
}

function css() {
    return src('./dev/scss/*.scss')
    .pipe(sass())
    .pipe(dest('./dist/css'));
}

function js() {
    return src('./dev/js/*.js')
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(dest('./dist/js'))
}

function watcher() {
    watch('./dev/pages/**/*.ejs', html);
    watch('./dev/scss/*.scss', css);
    watch('./dev/js/*.js', js);
    watch('./**/*.html', reload);
    watch('./dist/css/*.css', reload);
    watch('./dist/js/*.js', reload);
}

function serve(done) {
    browserSync.init({
        server: {
            baseDir: './dist/html',
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
exports.serve = serve;
exports.watcher = watcher;
exports.default = parallel(html, css, js, serve, watcher);
