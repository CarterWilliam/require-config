var configBuilder = require("./config-builder.js");


function main(mainFile, inputFiles, output) {

    console.log("require-config main()");
    console.log(mainFile);
    console.log(inputFiles);
    console.log(output);

    var config = configBuilder.buildConfig(mainFile, inputFiles);
}

module.exports = {
    main: main
}
