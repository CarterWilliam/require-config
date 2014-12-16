var path = require("path");

function buildConfig(mainFile, inputFiles) {
    console.log("buildConfig()");
    console.log(mainFile);
    console.log(inputFiles);

    var configBasePath = path.dirname(mainFile);
    var moduleRelativePaths = inputFiles.map(function(inputPath) {
        return path.relative(configBasePath, inputPath);
    });


    var config = {};

    console.log();
    console.log(configBasePath);
    console.log(moduleRelativePaths);

}

module.exports = {
    buildConfig: buildConfig
}
