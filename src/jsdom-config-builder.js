var path = require("path");
var fs = require("fs");
var vm = require("vm");
var jsdom = require("jsdom");
var logger = require("./logger.js");
var RequireConfig = require("./requirejs-configuration.js");
var Utils = require("./utils.js");


function buildConfig(mainFile, rawInputFilePaths, basePath, callback) {
    logger.info("\n");
    logger.info("jsdom-config-builder");
    logger.info("mainFile: " + mainFile);
    logger.info("rawInputFilePaths: " + rawInputFilePaths);
    logger.info("basePath: " + basePath);

    var config = new RequireConfig();

    var loadScriptsFrom = basePath ? path.resolve(basePath) : path.dirname(mainFile);
    if (basePath) {
        config.addBaseUrl(path.relative(path.dirname(mainFile), basePath));
    }


    processInputFileIteration(rawInputFilePaths, callback);

    function processInputFileIteration(inputFilePaths, callback) {

        if(inputFilePaths.length !== 0) {
            var headInputFilePath = inputFilePaths.pop();
            logger.info("Processing input file: " + headInputFilePath);

            jsdom.env({
                html: "<body></body>",
                scripts: ["http://requirejs.org/docs/release/2.1.15/minified/require.js"],
                features: {
                    FetchExternalResources   : ['script'],
                    ProcessExternalResources : ['script'],
                },
                loaded: function (errors, window) {
                    logger.info("JSDOM callback");

                    var initialGlobals = Object.keys(window);
                    var initialRequirejsRegistry = Utils.extractRegistry(window.requirejs);

                    window.requirejs.onError = window.requirejs.onScriptError = function() {
                        logger.info("RequireJS ERROR");
                        console.log("ERROR");
                    }

                    window.requirejs([headInputFilePath], function (amdModule) {

                        logger.info("RequireJS Callback");
                        var currentRequirejsRegistry = Utils.extractRegistry(window.requirejs);

                        var moduleName = path.basename(headInputFilePath, ".js");
                        var modulePath = path.relative(loadScriptsFrom, headInputFilePath);

                        if (amdModule) {
                            logger.info("AMD module: " + moduleName);
                            config.addPath(moduleName, modulePath);

                        } else if (initialRequirejsRegistry.length !== currentRequirejsRegistry.length) {
                            logger.info("AMD module with explicit name: " + moduleName);
                            currentRequirejsRegistry.forEach(function(registryEntry) {
                                if(initialRequirejsRegistry.indexOf(registryEntry) === -1 && !registryEntry.startsWith("_@")) {
                                    moduleName = registryEntry;
                                    config.addPath(moduleName, modulePath);
                                }
                            });

                        } else {
                            logger.info("Browser Global: " + moduleName);
                            config.addPath(moduleName, modulePath);

                            // Shim Entry
                            var currentGlobals = Object.keys(window);
                            config.addShimEntry(moduleName, currentGlobals.filter(function(globle) {
                                return initialGlobals.indexOf(globle) === -1;
                            }));
                        }

                        processInputFileIteration(inputFilePaths, callback);
                    });

                }
            });

        } else {
            logger.info("No more input files returning configuration");
            callback(config);
        }

    }

}

module.exports = {
    buildConfig: buildConfig
};
