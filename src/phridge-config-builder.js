require("es6-shim");
var path = require("path");
var phridge = require("phridge");
var Utils = require("./utils.js");
var logger = require("./logger.js");
var RequireConfig = require("./requirejs-configuration.js");


var requirejsPath = require.resolve("requirejs");


function buildConfig(mainFile, inputFiles, basePath, completeCallback) {
    logger.info("phridge-config-builder");
    logger.info(mainFile);
    logger.info(inputFiles);
    logger.info(basePath);

    var configBasePath = basePath ? path.resolve(basePath) : path.dirname(mainFile);

    var config = new RequireConfig();

    if (basePath) {
        config.addBaseUrl(path.relative(path.dirname(mainFile), basePath));
    }

    var inputFilePaths = inputFiles.map(function(absolutePath) {
        return path.resolve(absolutePath);
    });


    phridge.spawn({
        loadImages: false
    }).then(function (phantom) {
        processInputFileIteration(inputFilePaths, phantom);
    });

    function processInputFileIteration(inputFilePaths, phantomProcess) {

        if (inputFilePaths.length < 1) {
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

                    var initialRegistry = extractRegistry(requirejs);
                    var initialWindowContext = Object.keys(window);

                    requirejs([ libPath ], function(amd) {

                        var currentRegistry = extractRegistry(requirejs);

                        if (amd) {
                            resolve({ type: "AMD" });
                        } else if (currentRegistry.length > initialRegistry.length) {
                            var moduleName;
                            currentRegistry.forEach(function(registryEntry) {
                                if(initialRegistry.indexOf(registryEntry) === -1) {
                                    moduleName = registryEntry;
                                }
                            });

                            resolve({ type: "ENAMD", name: moduleName });
                        } else {
                            var exported = [];
                            var currentWindowContext = Object.keys(window);
                            currentWindowContext.forEach(function(object) {
                                if (initialWindowContext.indexOf(object) === -1) {
                                    exported.push(object);
                                }
                            });
                            resolve({ type: "BG", exportables: exported });

                        }
                    });

                };
                script.src = "http://requirejs.org/docs/release/2.1.15/minified/require.js";
                document.getElementsByTagName('head')[0].appendChild(script);

            }).then(function(moduleInfo) {
                page.dispose();

                var modulePath = path.relative(configBasePath, inputPath);

                switch(moduleInfo.type) {
                    case "AMD":
                        var moduleName = path.basename(inputPath, ".js");
                        config.addPath(moduleName, modulePath);
                        break;
                    case "ENAMD":
                        config.addPath(moduleInfo.name, modulePath);
                        break;
                    case "BG":
                        var moduleName = path.basename(inputPath, ".js");
                        config.addPath(moduleName, modulePath);
                        config.addShimEntry(moduleName, moduleInfo.exportables);
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
