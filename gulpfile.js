const gulp = require('gulp')
const data = require('gulp-data')
const twig = require('gulp-twig')
const plumber = require('gulp-plumber')
const clean = require('gulp-clean')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const cleanCss = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')

const browserSync = require('browser-sync').create()
const webpack = require('webpack-stream')

const imagemin = require('gulp-imagemin')

const htmlmin = require('gulp-htmlmin')

const fs = require('fs')
const path = require('path')

sass.compiler = require('node-sass')

gulp.task('twig', function() {
  return gulp.src('src/templates/pages/*.twig')
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end')
      }
    }))
    .pipe(data(function (file) {
      return JSON.parse(fs.readFileSync('src/data/' + path.basename(file.path) + '.json'))
    }))
    .pipe(twig())
    .on('error', function(err) {
      process.stderr.write(err.message + '\n')
      this.emit('end')
    })
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
})

gulp.task('sass', function() {
  return gulp.src('src/scss/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(autoprefixer())
    .pipe(sass())

    .pipe(
      cleanCss()
    )

    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
})

gulp.task('js', function() {
  return gulp.src('src/js/*')
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'index.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
          {
            test: /\.(glsl|vs|fs|vert|frag|txt)$/,
            exclude: /node_moduels/,
            use: [
              'raw-loader',
            ]
          },
        ],
      },
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
})

gulp.task('fonts', function() {
  return gulp.src('src/fonts/*')
    .pipe(clean())
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('images', function() {
  return gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
})

gulp.task('watch', function() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'dist'
    }
  })

  gulp.watch('src/templates/**/*.*', gulp.series('twig')).on('change', browserSync.reload)
  gulp.watch('src/data/*.json', gulp.series('twig')).on('change', browserSync.reload)
  gulp.watch('src/scss/**/*.*', gulp.series('sass'))
  gulp.watch('src/js/*', gulp.series('js'))
  gulp.watch('src/fonts/*', gulp.series('fonts'))
  gulp.watch('src/img/*', gulp.series('images'))
})

gulp.task('default', gulp.series('twig', 'sass', 'js', 'fonts', 'images', 'watch'))
