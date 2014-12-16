require("es6-shim");
var path = require("path");
var requirejs = require("requirejs");
var Utils = require("./utils.js");
var fs = require("fs");
var vm = require("vm");


function buildConfig(mainFile, inputFiles, callback) {
    console.log("config-builder - buildConfig()");
    console.log(mainFile);
    console.log(inputFiles);

    var configBasePath = path.dirname(mainFile);

    var config = {
        paths: {},
        shim:{}
    };

    processInputFileIteration(inputFiles, callback);

    function processInputFileIteration(inputFilePaths, callback) {

        if(inputFilePaths.length !== 0) {
            var headFile = inputFilePaths.pop();
            var initialRegistry = Object.keys(Utils.clone(requirejs.s.contexts._.registry));

            requirejs([headFile], function(amdModule){
                var currentRegistry = Object.keys(Utils.clone(requirejs.s.contexts._.registry));

                if (amdModule) {
                    // Module is AMD
                    var moduleName = path.basename(headFile,'.js');
                    config.paths[moduleName] = path.relative(configBasePath, headFile);

                } else if(initialRegistry.length !== currentRegistry.length) {
                    // Module is AMD with explicit name
                    currentRegistry.forEach(function(registryEntry) {
                        if(initialRegistry.indexOf(registryEntry) === -1 && !registryEntry.startsWith("_@")) {
                            config.paths[registryEntry] = path.relative(configBasePath, headFile);
                        }
                    });

                } else {
                    // Module is a browser global
                    moduleName = path.basename(headFile,'.js');
                    config.paths[moduleName] = path.relative(configBasePath, headFile);


                    // Shim etc.
                    var scriptContext = {};
                    var script = fs.readFileSync(headFile);

                    vm.runInNewContext(script, scriptContext);

                    console.log(scriptContext);
                    var exportables = Object.keys(scriptContext);
                    if (exportables.length === 1) {
                        // single browser global!
                        console.log("adding to shim config");
                        config.shim[moduleName] = { exports: exportables[0] };
                    }

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
