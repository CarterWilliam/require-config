function main(mainFile, inputFiles, output, browser) {

    console.log();
    console.log("require-config main()");
    console.log(mainFile);
    console.log(inputFiles);
    console.log(output);
    console.log(browser);

    var configBuilder = browser ? require("./phridge-config-builder") : require("./config-builder.js");


    var config = configBuilder.buildConfig(mainFile, inputFiles, function(configuration) {
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
