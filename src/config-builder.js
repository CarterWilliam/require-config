require("es6-shim");
var path = require("path");
var requirejs = require("requirejs");
var Utils = require("./utils.js");
var shimHelper = require("./shim-entry.js");
var logger = require("./logger.js");
var RequireConfig = require("./requirejs-configuration.js");

function buildConfig(mainFile, inputFiles, basePath, callback) {
    logger.info("config-builder");
    logger.info(mainFile);
    logger.info(inputFiles);
    logger.info(basePath);

    var configBasePath = basePath ? path.resolve(basePath) : path.dirname(mainFile);

    var config = new RequireConfig();

    if (basePath) {
        config.addBaseUrl(path.relative(path.dirname(mainFile), basePath));
    }

    processInputFileIteration(inputFiles, callback);

    function processInputFileIteration(inputFilePaths, callback) {

        if(inputFilePaths.length !== 0) {
            var headFile = inputFilePaths.pop();
            var initialRegistry = Utils.extractRegistry(requirejs);

            requirejs([headFile], function(amdModule){
                var currentRegistry = Utils.extractRegistry(requirejs);

                if (amdModule) {
                    // Module is AMD
                    var moduleName = path.basename(headFile,'.js');
                    config.addPath(moduleName, path.relative(configBasePath, headFile));

                } else if(initialRegistry.length !== currentRegistry.length) {
                    // Module is AMD with explicit name
                    currentRegistry.forEach(function(registryEntry) {
                        if(initialRegistry.indexOf(registryEntry) === -1 && !registryEntry.startsWith("_@")) {
                            config.addPath(registryEntry, path.relative(configBasePath, headFile));
                        }
                    });

                } else {
                    // Module is a browser global
                    moduleName = path.basename(headFile,'.js');

                    config.addPath(moduleName, path.relative(configBasePath, headFile));
                    config.addShimEntry(moduleName, shimHelper.exportables(headFile));
                }

                processInputFileIteration(inputFilePaths, callback);

            });

        } else {
            callback(config);
        }

    }

}

module.exports = {
    buildConfig: buildConfig
}
