
const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const rollup = require('rollup')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const babel=require('gulp-babel');
const babels = require('rollup-plugin-babel');
const sass = require('gulp-sass')

const dir_name = "release",
      file_name = "fire-dom",
      mudule_name = "$"


// 处理 JS
gulp.task('js', async ()=>{
  const bundle = await rollup.rollup({
    input: './src/js/index.js',
    plugins:[babels(
        {
          exclude: 'node_modules/**' // only transpile our source code
      })
    ]
  });
  const bundle1 =await bundle.write({
    file: `./${dir_name}/js/${file_name}.js`,
    format: 'umd',
    name: mudule_name,
    sourcemap: false
  }).then(()=>{
  	 gulp.src(`./${dir_name}/js/${file_name}.js`)
    	.pipe(babel({
	      	presets: ['@babel/env']
	    }))
	    .pipe(uglify())
	    .pipe(rename({suffix: '.min'}))
	    .pipe(gulp.dest(`./${dir_name}/js`));
  })
});

gulp.task('default',gulp.series(gulp.parallel('js')));

