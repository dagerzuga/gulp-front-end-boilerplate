// ******************* General plugins
const gulp = require('gulp');
const browserSync = require('browser-sync').create(); // BrowserSync to live-reload the browser
require('dotenv').config(); // Load environment variables from .env file

// ******************* Plugins to handle files
const rename = require('gulp-rename'); // Rename files in a gulp pipeline
const del = require('del'); // Delete files and folders using globs https://github.com/sindresorhus/globby#globbing-patterns
const replace = require('gulp-replace'); // Replace strings in files by using string or regex patterns

// ******************* Plugins to handle Markup
const htmlmin = require('gulp-htmlmin'); // Minify HTML
const strip = require('gulp-strip-comments'); // Remove comments from files (Used in the HTML task)

// ******************* Plugins to handle styles
const sass = require('gulp-sass')(require('sass')); // Compile Sass to CSS
const cleanCSS = require('gulp-clean-css'); // Minify CSS
const purgecss = require('purgecss'); // PurgeCSS to remove unused CSS
const gulpPurgecss = require('gulp-purgecss'); // Gulp plugin for PurgeCSS

// ******************* Plugins to handle scripts
const rollup = require('rollup'); // Rollup to bundle JS files
const typescript = require('rollup-plugin-typescript2'); // Rollup plugin to compile TypeScript
const commonjs = require('@rollup/plugin-commonjs'); // Rollup plugin to convert CommonJS modules to ES6
const resolve = require('@rollup/plugin-node-resolve'); // Rollup plugin to resolve node modules
const terser  = require('@rollup/plugin-terser'); // Rollup plugin to minify JS

// ******************* Plugins to handle assets
const tinify = require('gulp-tinify'); // Optimize images using the Tinify API
const newer = require('gulp-newer'); // Pass through newer source files only
const svgmin = require('gulp-svgmin'); // Minify SVG files

// *********************************************
// Paths
// *********************************************
const paths = {
  src: {
    style: {
      input: 'src/scss/**/*.scss',
      output: 'src/css',
    },
    script: {
      input: 'src/typescript/**/*.ts',
      output: 'src/js/',
      outputFileName: 'src/js/app.js',
    },
    images: 'src/images/**/*.+(WebP|jpeg|png)', // Corrected pattern for images
    svg: 'src/images/**/*.svg',
    html: 'src/**/*.html', // Updated path for HTML files
  },
  dist: {
    base: 'dist',
    styles: 'dist/css',
    scripts: 'dist/js',
    images: 'dist/images',
    svg: 'dist/images',
  },
};

// *********************************************
// Functions for development
// *********************************************
function generateDevStyles() {
  return gulp
    .src(paths.src.style.input) // Source file: src/styles/main.scss
    .pipe(sass().on('error', sass.logError)) // Compile Sass to CSS
    .pipe(gulp.dest(paths.src.style.output)) // Output unoptimized CSS to "src/styles" folder
    .pipe(browserSync.stream()); // Reload the browser when the styles are updated
}

async function generateDevScripts() {
  const bundle = await rollup.rollup({
    input: 'src/typescript/app.ts',
    plugins: [
      typescript(),
      commonjs(),
      resolve(),
    ],
  });

  await bundle.write({
    file: paths.src.script.outputFileName,
    format: 'iife',
    sourcemap: true,
  });

  return gulp.src(paths.src.script.outputFileName).pipe(browserSync.stream());
}

function watchChanges() {
  browserSync.init({
    server: {
      baseDir: './src/',
    },
  });

  gulp.watch(paths.src.style.input, generateDevStyles);
  gulp.watch(paths.src.script.input, generateDevScripts);
  gulp.watch('src/**/*').on('change', browserSync.reload);
}

// *********************************************
// Functions for production
// *********************************************
function generateProdStyles() {
  return gulp
          .src(paths.src.style.input) // Source file
          .pipe(sass().on('error', sass.logError))
          .pipe(cleanCSS()) // Minify CSS
          .pipe(rename({ suffix: '.min' })) // Rename the output file with '.min' suffix
          .pipe(gulp.dest(paths.dist.styles)); // Destination folder
}

async function generateProdScripts() {
  const bundle = await rollup.rollup({
    input: 'src/typescript/app.ts',
    plugins: [
      typescript(), // Compile TypeScript
      commonjs(), // Convert CommonJS modules to ES6
      resolve(), // Resolve node modules
      terser(), // Minify JS
    ],
  });

  await bundle.write({
    file: paths.dist.scripts + '/app.min.js',
    format: 'iife',
    sourcemap: false, // Sourcemap is not required in production, so set it to false
  });
}

function optimizeImages() {
  return gulp
    .src(paths.src.images) // Source folder
    .pipe(newer(paths.dist.images)) // Pass through newer source files only
    .pipe(tinify(process.env.TINIFY_API_KEY)) // Optimize images
    .pipe(gulp.dest(paths.dist.images)); // Destination folder
}

function optimizeSVGs() {
  return gulp
          .src(paths.src.svg)
          .pipe(svgmin())
          .pipe(gulp.dest(paths.dist.svg));
}

function updateMakupReferences() {
  return gulp
    .src('dist/index.html')
    .pipe(replace('main.css', 'main.min.css')) // Replace 'main.css' with 'main.min.css'
    .pipe(replace('app.js', 'app.min.js')) // Replace 'app.js' with 'app.min.js'
    .pipe(gulp.dest(paths.dist.base)); // Output updated index.html to the dist folder
}

function optimizeMarkup() {
  return gulp
    .src(paths.src.html)
    .pipe(strip()) // Remove comments
    .pipe(htmlmin({ collapseWhitespace: true })) // Minify HTML
    .pipe(gulp.dest(paths.dist.base));
}

function purgeStyles() {
  const content = ['dist/**/*.html', 'dist/**/*.js']; // Add other files where CSS is used

  return gulp
    .src('dist/css/main.min.css') // Replace with your main CSS file path
    .pipe(
      gulpPurgecss({
        content: content,
        safelist: {
          // standard: ['active'], // Add any classes that you want to keep even if PurgeCSS detects them as unused
        },
      })
    )
    .pipe(gulp.dest('dist/css')); // Output the optimized CSS to the dist/css folder
}

// *********************************************
// Other functions
// *********************************************
function cleanStaticFiles() {
  // Clean the dist folder and the generated files in the src folder
  return del([paths.dist.base, paths.src.style.output, paths.src.script.output]);
}

// *********************************************
// List of tasks
// *********************************************
gulp.task('dev', gulp.parallel(generateDevStyles, generateDevScripts, watchChanges));
gulp.task('prod', gulp.series(cleanStaticFiles, generateProdStyles, generateProdScripts, optimizeImages, optimizeSVGs, optimizeMarkup, updateMakupReferences, purgeStyles));
gulp.task('clean', cleanStaticFiles);
