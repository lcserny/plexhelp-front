// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
process.env.CHROME_BIN = "/opt/google/chrome/google-chrome";

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            jasmine: {
                // you can add configuration options for Jasmine here
                // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
                // for example, you can disable the random execution with `random: false`
                // or set a specific seed with `seed: 4321`
            },
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage/front'),
            subdir: '.',
            reporters: [
                {type: 'html'},
                {type: 'text-summary'}
            ]
        },
        reporters: ['progress', 'kjhtml'],
        browsers: ['Chrome', "ChromeHeadless", "ChromeHeadless_custom"],
        restartOnFileChange: true,
        customLaunchers: {
            ChromeHeadless_custom: {
                base: 'ChromeHeadless',
                flags: ['--disable-search-engine-choice-screen', '--no-sandbox']
            }
        },
        singleRun: true
    });
};
