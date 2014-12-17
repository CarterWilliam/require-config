require("es6-shim");
var path = require("path");
var requirejs = require("requirejs");
var Utils = require("./utils.js");
var shimHelper = require("./shim-entry.js")
var RequireConfig = require("./requirejs-configuration.js")

function buildConfig(mainFile, inputFiles, basePath, callback) {
    console.log("config-builder - buildConfig()");
    console.log(mainFile);
    console.log(inputFiles);

    var configBasePath = basePath? basePath : path.dirname(mainFile);
    console.log("configBasePath = " + configBasePath);

    var config = new RequireConfig(configBasePath);

    processInputFileIteration(inputFiles, callback);

    function processInputFileIteration(inputFilePaths, callback) {

        if(inputFilePaths.length !== 0) {
            var headFile = inputFilePaths.pop();
            console.log(headFile);
            var initialRegistry = Utils.extractRegistry(requirejs);

            requirejs([headFile], function(amdModule){
                var currentRegistry = Utils.extractRegistry(requirejs);

                if (amdModule) {
                    // Module is AMD
                    console.log("AMD");
                    var moduleName = path.basename(headFile,'.js');
                    config.addPath(moduleName, path.relative(configBasePath, headFile));

                } else if(initialRegistry.length !== currentRegistry.length) {
                    // Module is AMD with explicit name
                    console.log("Explicitly named AMD");
                    console.log(initialRegistry);
                    console.log(currentRegistry);
                    currentRegistry.forEach(function(registryEntry) {
                        if(initialRegistry.indexOf(registryEntry) === -1 && !registryEntry.startsWith("_@")) {
                            config.addPath(registryEntry, path.relative(configBasePath, headFile));
                        }
                    });

                } else {
                    // Module is a browser global
                    console.log("Browser global");
                    moduleName = path.basename(headFile,'.js');

                    console.log(config.addPath);
                    console.log(config.addShimEntry);
                    console.log(shimHelper);
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
