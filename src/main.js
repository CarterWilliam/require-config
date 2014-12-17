var logger = require("./logger.js");

function main(mainFile, inputFiles, output, browser, basePath) {

    logger.info();
    logger.info("--- RequireJS Configuration ---");

    logger.info("mainFile = " + mainFile);
    logger.info("inputFiles = " + inputFiles);
    logger.info("output = " + output);
    logger.info("browser = " + browser);
    logger.info("basePath = " + basePath);

    var configBuilder = browser ? require("./phridge-config-builder") : require("./config-builder.js");


    var config = configBuilder.buildConfig(mainFile, inputFiles, basePath, function(configuration) {
        console.log(configuration.toString());
    });

}

module.exports = {
    main: main
}
