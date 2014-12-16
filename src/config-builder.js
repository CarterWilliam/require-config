require("es6-shim");
var path = require("path");
var requirejs = require("requirejs");
var Utils = require("./utils.js");

function buildConfig(mainFile, inputFiles, callback) {
    console.log("buildConfig()");
    console.log(mainFile);
    console.log(inputFiles);

    var configBasePath = path.dirname(mainFile);

    var config = {
        paths: {}
    };

    processInputFileIteration(inputFiles, callback);

    function processInputFileIteration(inputFilePaths, callback) {

        if(inputFilePaths.length!==0) {
            var headFile=inputFilePaths.pop();
            var initialRegistry = Object.keys(Utils.clone(requirejs.s.contexts._.registry));

            requirejs([headFile], function(){
                var currentRegistry = Object.keys(Utils.clone(requirejs.s.contexts._.registry));

                var moduleName;
                if(initialRegistry.length!==currentRegistry.length) {
                    currentRegistry.forEach(function(registryEntry){
                        if(initialRegistry.indexOf(registryEntry) === -1 && !registryEntry.startsWith("_@")) {
                            moduleName=registryEntry;
                        }
                    })
                }
                moduleName = moduleName || path.basename(headFile,'.js');

                config.paths[moduleName] = path.relative(configBasePath, headFile);
                processInputFileIteration(inputFilePaths, callback);
            });
        }
        else{
            callback(config);
        }

    }


}

module.exports = {
    buildConfig: buildConfig
}
