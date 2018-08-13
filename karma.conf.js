module.exports = (config) => {
    config.set({
        frameworks: ["jasmine"],
        plugins: [require("karma-jasmine"), require("karma-chrome-launcher"), require("karma-jasmine-html-reporter")],
        files: [
            "node_modules/reflect-metadata/Reflect.js",
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/zone.js/dist/zone.js",
            "node_modules/zone.js/dist/proxy.js",
            "node_modules/zone.js/dist/sync-test.js",
            "node_modules/zone.js/dist/jasmine-patch.js",
            "node_modules/zone.js/dist/async-test.js",
            "node_modules/zone.js/dist/fake-async-test.js",
            { pattern: "bower_components/alertify-js/build/alertify.min.js", included: true, watched: false },
            { pattern: "node_modules/rxjs/**/*.js", included: false, watched: false },
            { pattern: "node_modules/@angular/**/*.js", included: false, watched: false },
            { pattern: "node_modules/auth0-js/**/*.js", included: false, watched: false },
            { pattern: "node_modules/tslib/*.js", included: false, watched: true },
            { pattern: "node_modules/ngx-bootstrap/bundles/*.js", included: false, watched: true },
            { pattern: "build/**/*.js", included: false, watched: true },
            { pattern: "build/**/*.html", included: false, watched: true },
            { pattern: "build/**/*.css", included: false, watched: true },
            { pattern: "karma-test-shim.js", included: true, watched: true },
        ],
        reporters: ["progress", "kjhtml"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ["Chrome"],
        singleRun: false
    })
}