# gulp-front-end-boilerplate 🥤

Boilerplate for front-end development using Gulp to handle all the boring tasks nobody wants to do.

## Features

- `src` and `dist` folders to keep things organized
  - `src` folder is where you put your source files. You work here
  - `dist` folder is where gulp will put your compiled files. You don't work here
- Live reload the browser when you update a file in `src` folder
- Handles styles
  - Compiles Sass to CSS
  - Minifies CSS
  - Remove comments
- Handles scripts
  - Compiles TypeScript to JavaScript
  - Minifies JavaScript
  - Remove comments
  - Concatenates JavaScript files into one
- Handles HTML
  - Minifies HTML
  - Remove comments
  - Updates references to CSS and JavaScript files to use the minified versions
- Handles images
  - Compresses images in WebP, JPEG and PNG formats
  - Compresses SVG files


## Available gulp.js tasks
- `gulp dev` Run this command to start the development server. It will watch for changes in the `src` folder and reload the browser when a change is detected.
- `gulp build` Run this command to build the project. It will compile all the files and put them in the `dist` folder. This is the folder you will upload to your server.
- `gulp clean` Run this command to delete the `dist` folder. This is useful when you want to start fresh. Keep in mind this also deletes the files under `src/js` and `src/css`.

## Folder structure

This is the folder structure of the project. You will work in the `src` folder and gulp will compile the files and put them in the `dist` folder.

Keep in mind that when you clone the repo, `dist/` `node_modules`, `src/js` and `src/css` won't exist. The content of `dist/` will be generated once you run `gulp prod`, `node_modules` will be created when you run `npm install` and `src/js` and `src/css` will be created when you run `gulp dev`.

```
dist/                      # This is where gulp will put the compiled files. You don't work here
├── css/                   # The folder where gulp will put the compiled CSS file
│   └── main.min.css       # Compiled and minified CSS file that your page will use
├── images/                # The folder where gulp will put the compressed images (PNG, WebP, JPEG and SVG)
├── js/                    # The folder where gulp will put the compiled JavaScript files
│   └── app.min.js         # Compiled and minified JavaScript file
├── index.html             # Minified and uncommented HTML file
node_modules/              # Dependencies installed by npm. You don't need to touch this folder
src/                       # This is where you put your source files. You work here
├── css/                   # The folder where gulp will put the compiled unminified CSS file. You don't work here
│   └── main.css           # Compiled unminified CSS file. You don't touch this file
├── images/                # The folder where you put your images
├── js/                    # The folder where gulp will put the compiled unminified JavaScript files. You don't work here
│   └── app.js             # Compiled unminified JavaScript file. You don't touch this file
│   └── app.js.map         # Source map file. You don't touch this file
├── scss/                  # The folder where you put your scss files. You work here. https://sass-guidelin.es/
├── typescript/            # The folder where you put your typescript files. You work here
├── index.html             # The HTML file you will work on
.env                       # You will put your API keys and other sensitive information here. You need to create this file.
.gitignore                 # Files and folders that git will ignore
gulpfile.js                # The file where you configure gulp. All the tasks and functions are here.
package-lock.json          # npm will generate this file. You don't need to touch this file
package.json               # All the dependencies go here and some other information about the project
readme.md                  # This file
tsconfig.json              # TypeScript configuration file
```

## List of dependencies

```
@rollup/plugin-commonjs        # A Rollup plugin to convert CommonJS modules to ES6.
@rollup/plugin-node-resolve    # A Rollup plugin to resolve node modules.
@rollup/plugin-terser          # A Rollup plugin to minify JS files.
browser-sync                   # BrowserSync to live-reload the browser during development.
dotenv                         # A package to load environment variables from a .env file.
gulp                           # The task runner that automates various tasks during development.
gulp-clean-css                 # A Gulp plugin to minify and clean CSS files.
gulp-htmlmin                   # A Gulp plugin to minify HTML files.
gulp-newer                     # A Gulp plugin to pass through newer source files only.
gulp-purgecss                  # A Gulp plugin for PurgeCSS to remove unused CSS.
gulp-rename                    # A Gulp plugin to rename files in a gulp pipeline.
gulp-replace                   # A Gulp plugin to replace strings in files using string or regex patterns.
gulp-sass                      # A Gulp plugin to compile Sass to CSS.
gulp-strip-comments            # A Gulp plugin to remove comments from files.
gulp-svgmin                    # A Gulp plugin to minify SVG files.
gulp-tinify                    # A Gulp plugin to optimize images using the Tinify API.
purgecss                       # PurgeCSS to remove unused CSS from stylesheets.
rollup                         # A module bundler to bundle JavaScript files.
rollup-plugin-typescript       # A Rollup plugin to compile TypeScript files.
sass                           # A package to compile Sass to CSS.
```

## Customize the project
If you want to remove features or add new ones, you can do it by editing the `gulpfile.js` file. The idea of this project is that every task is done by a specific function, that way you can remove or add tasks easily. For example, if you don't want to minify the HTML, you can remove the `optimizeMarkup` function.

## Requirements
- node.js
- npm

## How to use

- Clone this repository
- Create a .env file and add this "TINIFY_API_KEY=YOUR_KEY_HERE". You need to replace `YOUR_KEY_HERE` with your own key. You can get a key at https://tinypng.com/developers
- Run `npm install` to install all dependencies
- Run `gulp dev` to start the development server
- Work in the `src` folder
- Run `gulp prod` to build the project when you are ready to deploy it

## Vulnerabilities

Right now this project has 9 vulnerabilities (6 high, 3 critical). However, these vulnerabilities are in the sub dependencies, not in the code of this project, therefore, they don't represent a security risk. You can check the vulnerabilities by running `npm audit`. I will update the dependencies when the maintainers fix the vulnerabilities.
