var configPrinter = require("./config-printer.js");

function main(mainFile, inputFiles, output, browser, basePath) {

    console.log();
    console.log("require-config main()");
    console.log("mainFile = " + mainFile);
    console.log("inputFiles = " + inputFiles);
    console.log("output = " + output);
    console.log("browser = " + browser);
    console.log("basePath = " + basePath);

    var configBuilder = browser ? require("./phridge-config-builder") : require("./config-builder.js");


    var config = configBuilder.buildConfig(mainFile, inputFiles, basePath, function(configuration) {
        console.log();
        console.log("--------------------");
        console.log();
        console.log(configuration);
        console.log();

    });

}

module.exports = {
    main: main
}
