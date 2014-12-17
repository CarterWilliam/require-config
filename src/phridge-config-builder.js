require("es6-shim");
var path = require("path");
var phridge = require("phridge");
var Utils = require("./utils.js");


var requirejsPath = require.resolve("requirejs");


function buildConfig(mainFile, inputFiles, basePath, completeCallback) {
    console.log("phridge-config-builder - buildConfig()");
    console.log(mainFile);
    console.log(inputFiles);

    console.log(Utils);
    var inputFilePaths = inputFiles.map(function(absolutePath) {
        return path.resolve(absolutePath);
    });
    console.log(inputFilePaths);

    var libraryPath = "/Users/cartew01/workspace/require-config/resources/amd.js";

    var config = {
        paths: {},
        shim:{}
    };


    phridge.spawn({
        loadImages: false
    }).then(function (phantom) {
        processInputFileIteration(inputFilePaths, phantom);
    });

    function processInputFileIteration(inputFilePaths, phantomProcess) {

        console.log("processInputFileIteration");
        console.log(inputFilePaths);

        if (inputFilePaths.length < 1) {
            console.log("complete");
            phantomProcess.dispose();
            completeCallback(config);
        } else {
            var inputPath = inputFilePaths.pop();

            var page = phantomProcess.createPage();

            page.run(inputPath, function (libPath, resolve, reject) {

                function extractRegistry(requirejs) { // see Utils.extractRegistry
                    var completeRegistryObject = JSON.parse(JSON.stringify(requirejs.s.contexts._.registry));
                    var completeRegistry = Object.keys(completeRegistryObject);
                    return completeRegistry.filter(function(moduleName) {
                        return moduleName.indexOf("_@") !== 0;
                    });
                }

                var script = document.createElement('script');
                script.onload = function() {
                    console.log("Script loaded and ready");

                    var initialRegistry = extractRegistry(requirejs);

                    requirejs([ libPath ], function(amd) {

                        var currentRegistry = extractRegistry(requirejs);
                        console.log(currentRegistry);

                        if (amd) {
                            resolve({ type: "AMD" });
                        } else if (currentRegistry.length > initialRegistry.length) {
                            console.log("Module is Strictly named AMD");
                            var moduleName;
                            currentRegistry.forEach(function(registryEntry) {
                                if(initialRegistry.indexOf(registryEntry) === -1) {
                                    moduleName = registryEntry;
                                }
                            });

                            resolve({ type: "ENAMD", name: moduleName });
                        } else {
                            resolve({ type: "BG" });
                        }
                    });

                };
                script.src = "http://requirejs.org/docs/release/2.1.15/minified/require.js";
                document.getElementsByTagName('head')[0].appendChild(script);

            }).then(function(moduleInfo) {
                console.log(moduleInfo);
                page.dispose();

                var configBasePath = path.dirname(mainFile);
                var modulePath = path.relative(configBasePath, inputPath);

                switch(moduleInfo.type) {
                    case "AMD":
                        var moduleName = path.basename(inputPath, ".js");
                        config.paths[moduleName] = modulePath;
                        break;
                    case "ENAMD":
                        config.paths[moduleInfo.name] = modulePath;
                        break;
                    case "BG":
                        var moduleName = path.basename(inputPath, ".js");
                        config.paths[moduleName] = modulePath;
                        break;
                }

                processInputFileIteration(inputFilePaths, phantomProcess)
            });
        }

    }

}



module.exports = {
    buildConfig: buildConfig
}
