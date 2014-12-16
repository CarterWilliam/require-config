var package = require("./package.json");
var coa = require("coa");

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
    .act(function(options) {

        // output file default
        var output = options.output || "requirejs-configuration.js"

        require("./src/main.js").main(options.mainFile, options.input, output, options.browser);
    })
.run();
