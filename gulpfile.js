const gulp = require('gulp')
const clean = require('gulp-clean')
const sass = require('gulp-sass')
const cleanCss = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')

const browserSync = require('browser-sync').create()
const webpack = require('webpack-stream')

const imagemin = require('gulp-imagemin')

const htmlmin = require('gulp-htmlmin')

sass.compiler = require('node-sass')

gulp.task('html', function() {
	return gulp.src('src/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('dist'))
})

gulp.task('sass', function() {
	return gulp.src('src/css/index.scss')
		.pipe(sourcemaps.init())
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

	gulp.watch('src/*.html', gulp.series('html')).on('change', browserSync.reload)
	gulp.watch('src/css/*.scss', gulp.series('sass'))
	gulp.watch('src/js/*', gulp.series('js'))
	gulp.watch('src/fonts/*', gulp.series('fonts'))
	gulp.watch('src/img/*', gulp.series('images'))
})

gulp.task('default', gulp.series('html', 'sass', 'js', 'fonts', 'images', 'watch'))
