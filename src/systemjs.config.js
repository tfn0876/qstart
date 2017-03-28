/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'lib/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      'ng2-pdf-viewer': 'npm:ng2-pdf-viewer',
      'pdfjs-dist': 'npm:pdfjs-dist',
      'angular2-jwt': 'npm:angular2-jwt/angular2-jwt.js',
      // other libraries
      'rxjs': 'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'angular2-highcharts': 'npm:angular2-highcharts',
      'highcharts': 'npm:highcharts',
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'ng2-pdf-viewer': {
        main: 'dist/index.js',
        defaultExtension: 'js'
      },
      'pdfjs-dist': {
        defaultExtension: 'js'
      },
      highcharts: {
        main: './highcharts.js',
        defaultExtension: 'js'
      },
      'angular2-highcharts': {
        main: './index.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);
