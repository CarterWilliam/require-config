var phridge = require("phridge");

var requirejsPath = require.resolve("requirejs");
var libraryPath = "/Users/cartew01/workspace/require-config/resources/amd.js";

console.log(requirejsPath);
console.log(libraryPath);

phridge.spawn({
    loadImages: false
}).then(function (phantom) {

    console.log("inside phantom process");

    var page = phantom.createPage();

    page.run(requirejsPath, function (requirejsPath, resolve, reject) {
        console.log("phantom logging");
        console.log(requirejsPath);

        script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        script.onload = function() {
            console.log("Script loaded");
            resolve(Math.PI);
        };
        script.src = requirejsPath;
        console.log("Add script");
        document.getElementsByTagName('head')[0].appendChild(script);


    }).then(function (pi) {
        console.log(pi); // true
        phantom.dispose();
    });
});
