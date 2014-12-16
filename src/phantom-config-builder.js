var phantom = require("phantom");

var requirejsPath = require.resolve("requirejs");
var libraryPath = "/Users/cartew01/workspace/require-config/resources/amd.js";

console.log(requirejsPath);
console.log(libraryPath);


phantom.create(function(phantomInstance) {

    phantomInstance.createPage(function (page) {
        page.injectJs(requirejsPath);

        page.evaluate(function (libraryPath) {

            require([libraryPath], function(amd) {
                window.amd = "amd";
            });

        },
        function () {
            console.log("callback 1");
        },
        libraryPath);

        setTimeout(function() {
            page.evaluate(function() {
                return window.amd;
            },
            function(result) {
                console.log("callback 2");
                console.log(result);
            });

            phantomInstance.exit();

        }, 1000);

        // phantomInstance.exit();
    });
});
