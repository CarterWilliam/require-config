var configBuilder = require("./config-builder.js");


function main(mainFile, inputFiles, output) {

    console.log();
    console.log("require-config main()");
    console.log(mainFile);
    console.log(inputFiles);
    console.log(output);

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
