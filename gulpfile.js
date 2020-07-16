const { watch, dest, src, parallel } = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssDeclarationSorter = require('css-declaration-sorter');
const imgMin = require('gulp-imagemin');
// const imgMinPng = require('imagemin-pngquant');
// const imgMinJpg = require('imagemin-jpeg-recompress');
// const imgMinGif = require('imagemin-gifsicle');
// const svgMin = require('gulp-svgmin');
const browserSync = require('browser-sync').create();

function html() {
    return src(['./dev/**/*.ejs','!' + './dev/components/*.ejs'])
    .pipe(ejs({ title: 'gulp-ejs' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('./dist'))
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

// function svg() {
//     return src('./dev/img/*.svg')
//     .pipe(svgMin())
//     .pipe(dest('./dist/img'))
// }

function watcher() {
    watch('./dev/pages/**/*.ejs', html);
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
// exports.svg = svg;
exports.serve = serve;
exports.watcher = watcher;
exports.default = parallel(img, html, css, js, serve, watcher);
