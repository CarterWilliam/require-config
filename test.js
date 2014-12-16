// var path = require('path')
// var childProcess = require('child_process')
// var phantomjs = require('phantomjs')
// var binPath = phantomjs.path
//
// var childArgs = [ path.join(__dirname, "print.js") ]
//
// childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
//     console.log("child process");
//     console.log(err);
//     console.log(stdout);
//     console.log(stderr);
// })

var phantom = require('phantom');


console.log("test.js");

phantom.create(function(phant) {

    phant.createPage(function (page) {
        page.injectJs("/Users/cartew01/workspace/require-config/resources/browser-global.js")
        page.evaluate(function () { return browserGlobal.name; }, function (result) {
            console.log('browserGlobal name - ' + result);
            phant.exit();
        });
    });
});
