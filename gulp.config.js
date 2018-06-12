var baseDirs = {
    // the root for all source code
    sourceRoot: "src/",
    // code root
    clientRoot: "client/",
    // the output path for the processed code
    destinationPath: 'build'
};

var configObject = {
    // A variable that points to the TypeScript source location
    // will find all TypeScript files in the clientRoot directory, recursively
    typeScriptSource: baseDirs.sourceRoot + baseDirs.clientRoot + "**/*.ts",
    //a variable that points to the HTML Source
    // will find all HTML Source files in the clientRoot directory, recursively
    htmlSource: baseDirs.sourceRoot + baseDirs.clientRoot + "**/*.html",
    // styles
    cssStyleURLsSource: baseDirs.sourceRoot + baseDirs.clientRoot + "**/*.css",
    // the final destination of the JavaScript libraries
    destinationPathForJSLibraries: baseDirs.destinationPath + "/client/node_modules",
    // destination of the Bower components
    destinationPathForBowerComponents: baseDirs.destinationPath + "/client/bower_components",
    // will find all images in the images folder
    imagesSource: baseDirs.sourceRoot + baseDirs.clientRoot + "app/images/**/*"
};

var staticConfig = {
    // points to node_modules install
    nodeModulesSource: "node_modules/**",
    //points to bower_components
    bowerComponents: "bower_components/**",
    // an array of Globs that point to the Angular libraries
    angularLibraries: [
        'html5-history-api/history.min.js',
        'classlist.js/classList.min.js',
        'core-js/client/shim*.js',
        'zone.js/dist/zone*.js',
        'reflect-metadata/Reflect*.js',
        'systemjs/dist/*.js',
        '@angular/**/*.js',
        'tslib/tslib.js',
        'lodash/**/*',
        'ngx-bootstrap/**/*'
    ],
    bower: [
        'alertify.js/lib/alertify.min.js',
        'alertify.js/themes/**/*',
        'bootstrap/dist/**/*'
    ],
    // a glob used to delete all files in the destination path before
    // cleaning up
    deletePath: [baseDirs.destinationPath + '/**'],
}

var plugins = {
    browserSync: {
        server: 'build/client',
        port: '3000',
        ghostMode: false,
        reloadDelay: 1000,
        reloadDebounce: 1000,
        injectChanges: false,
        minify: false,
        browser: 'chrome'
    }
}
exports.config = Object.assign(baseDirs, configObject, staticConfig, plugins);