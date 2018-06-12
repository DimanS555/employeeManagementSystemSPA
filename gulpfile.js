let config = require('./gulp.config.js').config;
let gulp = require('gulp');
let del = require('del');
let tslint = require('gulp-tslint');
let tsc = require('gulp-typescript');
let tsProject = tsc.createProject('tsconfig.json');
let uglify = require('gulp-uglify-es').default;
let cleanCSS = require('gulp-clean-css');
let SystemBuilder = require('systemjs-builder');
let browserSync = require('browser-sync').create();

gulp.task('systemjs', function () {
    return gulp.src(config.sourceRoot + config.clientRoot + 'systemjs.config.js')
        .pipe(gulp.dest(config.destinationPath + '/client'));
});

gulp.task('rxjs.bundle', function (cb) {
    let builder = new SystemBuilder('./');
    builder.config({
        paths: {
            "rxjs/*": "node_modules/rxjs/*.js"
        },
        map: {
            "rxjs": "node_modules/rxjs"
        },
        packages: {
            "rxjs": { main: "Rx.js", defaultExtension: "js" }
        }
    });

    builder.bundle("rxjs", "build/client/rxjs.module.min.js", {
        normalize: true,
        runtime: false,
        minify: true,
        mangle: false
    });
    cb();
});

// Lint all custom TypeScript files.
gulp.task('tslint', function () {
    return gulp.src(config.typeScriptSource, { base: config.sourceRoot }, { since: gulp.lastRun('tslint') })
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report());
});

// the basic task for compiling TypeScript; will run lint on the files first.
// will minimize code w/ uglify and optionally create source maps
gulp.task('buildTS', function () {
    let tsResult = gulp.src(config.typeScriptSource, { base: config.sourceRoot }, { since: gulp.lastRun('buildTS') })
        .pipe(tsProject());
    return tsResult.js
        .pipe(uglify())
        .pipe(gulp.dest(config.destinationPath));
});

gulp.task('typeScript', gulp.series('tslint', 'buildTS'));

// a task to copy HTML files from src to the build folder
gulp.task('copyHTML', function () {
    return gulp.src(config.htmlSource, { base: config.sourceRoot }, { since: gulp.lastRun('copyHTML') })
        .pipe(gulp.dest(config.destinationPath));
});

gulp.task('copyAngularCSS', function () {
    return gulp.src(config.cssStyleURLsSource, { base: config.sourceRoot }, { since: gulp.lastRun('copyAngularCSS') })
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.destinationPath));
});

// images
gulp.task('images', function () {
    return gulp.src(config.imagesSource, { base: config.sourceRoot })
        .pipe(gulp.dest(config.destinationPath));
});

// task to copy all the angular libraries
// and other dependencies installed by Node
gulp.task('copyAngularLibraries', function () {
    // copy JS libraries custom to the project
    return gulp.src(config.angularLibraries, { cwd: config.nodeModulesSource })
        .pipe(gulp.dest(config.destinationPathForJSLibraries));
});

gulp.task('copyBowerComponents', function () {
    return gulp.src(config.bower, { cwd: config.bowerComponents })
        .pipe(gulp.dest(config.destinationPathForBowerComponents));
});

// a task to delete the build directory and everything in it
gulp.task('clean', function () {
    return del(config.deletePath);
});


// Build the project.
gulp.task('build', gulp.series('systemjs', 'rxjs.bundle', 'typeScript', 'copyHTML', 'copyAngularCSS', 'images', 'copyAngularLibraries', 'copyBowerComponents'));

// delete everything then build the project
gulp.task('cleanBuild', gulp.series('clean', 'build'));

// watching for changes on the fly
gulp.task('watch', function () {
    gulp.watch(config.typeScriptSource, gulp.series('typeScript'));

    gulp.watch(config.htmlSource, gulp.series('copyHTML'));

    gulp.watch(config.cssStyleURLsSource, gulp.series('copyAngularCSS'));
});

gulp.task('browserSync', browserSyncInit);

function browserSyncInit() {
    browserSync.init(config.browserSync);
    browserSync.watch('build/**/*.*').on('change', browserSync.reload);
}

gulp.task('serve', gulp.series('cleanBuild', gulp.parallel('watch', 'browserSync')));
