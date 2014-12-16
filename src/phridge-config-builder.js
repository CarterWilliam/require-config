var phridge = require("phridge");

var requirejsPath = require.resolve("requirejs");
var libraryPath = "/Users/cartew01/workspace/require-config/resources/amd.js";

console.log(requirejsPath);
console.log(libraryPath);

phridge.spawn({
    loadImages: false
}).then(function (phantom) {


    var page = phantom.createPage();

    page.run(libraryPath, function (libPath, resolve, reject) {

        var script = document.createElement('script');
        script.onload = function() {
            alert("Script loaded and ready");
            requirejs([ libPath ], function(amd) {
                resolve(amd);
            });

        };
        script.src = "http://requirejs.org/docs/release/2.1.15/minified/require.js";
        document.getElementsByTagName('head')[0].appendChild(script);

    }).then(function(returned) {
        console.log("done");
        console.log(returned);
        phantom.dispose();
    });

});
