__karma__.loaded = function () { };

let packages = {
    "app": {
        defaultExtension: "js"
    },
    "rxjs": { main: "Rx.js", defaultExtension: "js" },
    "auth0-js": { main: "build/auth0.js", defaultExtension: "js" },
    "ngx-bootstrap": { format: 'cjs', main: 'bundles/ngx-bootstrap.umd.js', defaultExtension: 'js' }
}

let map = {
    "rxjs": "node_modules/rxjs",
    "auth0-js": "node_modules/auth0-js",
    "tslib": "node_modules/tslib/tslib.js",
    "ngx-bootstrap": "node_modules/ngx-bootstrap"
}

var angularModules = ["common", "compiler", "core", "platform-browser",
    "platform-browser-dynamic", "forms", "router"];

angularModules.forEach(module => {
    map[`@angular/${module}`] =
        `node_modules/@angular/${module}/bundles/${module}.umd.js`;
    map[`@angular/${module}/testing`] =
        `node_modules/@angular/${module}/bundles/${module}-testing.umd.js`
});

map['@angular/common/http'] = 'node_modules/@angular/common/bundles/common-http.umd.js';
map['tslib'] = 'node_modules/tslib/tslib.js',
    map['@angular/common/http/testing'] = 'node_modules/@angular/common/bundles/common-http-testing.umd.js';
map['app'] = 'build'

System.config({ baseURL: "/base", map: map, packages: packages, defaultExtensions: true });

Promise.all([
    System.import("@angular/core/testing"),
    System.import("@angular/platform-browser-dynamic/testing")
]).then(providers => {
    var testing = providers[0];
    var testingBrowser = providers[1];
    testing.TestBed.initTestEnvironment(testingBrowser.BrowserDynamicTestingModule,
        testingBrowser.platformBrowserDynamicTesting());
}).then(() => Promise.all(Object.keys(window.__karma__.files)
    .filter(name => name.endsWith("spec.js"))
    .map(moduleName => System.import(moduleName))))
    .then(__karma__.start, __karma__.error);