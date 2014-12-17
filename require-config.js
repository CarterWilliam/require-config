require("es6-shim");
var package = require("./package.json");
var coa = require("coa");
var fs = require("fs");
var path = require("path");

module.exports = coa.Cmd()
    .name("require-config")
    .title("require-config")
    .opt()
        .name("version")
        .title("Version")
        .short("v")
        .long("version")
        .flag()
        .act(function() {
          return package.version;
        })
        .only()
    .end()
    .opt()
        .name("mainFile")
        .title("'main.js' file")
        .short("m")
        .long("mainfile")
        .req()
    .end()
    .opt()
        .name("input")
        .title("input")
        .short("i")
        .long("input")
        .arr()
        .req()
    .end()
    .opt()
        .name("output")
        .title("output")
        .short("o")
        .long("output")
    .end()
    .opt()
        .name("browser")
        .title("browser")
        .short("b")
        .long("browser")
        .flag()
    .end()
    .opt()
        .name("basePath")
        .title("base path")
        .short("p")
        .long("basePath")
    .end()
    .act(function(options) {

        // output file default
        var output = options.output || "requirejs-configuration.js"

        // detect folders in set of input files, extract all .js file paths from these folders and replace
        var inputFiles = [];
        options.input.forEach(function(inputParameter){
            if (fs.lstatSync(inputParameter).isFile()) {
                inputFiles.push(inputParameter);
            }
            else {
                // list all .js files within this folder and push them to inputFiles
                var allFiles = fs.readdirSync(inputParameter);
                allFiles.forEach(function(listingEntry){
                    var fullFilename = path.join(inputParameter,listingEntry) ;
                    if(fullFilename.endsWith(".js") && fs.lstatSync(fullFilename).isFile()) {
                        inputFiles.push(fullFilename); 
                    }
                })
            }
        });


        require("./src/main.js").main(options.mainFile, inputFiles, output, options.browser, options.basePath);
    })
.run();
