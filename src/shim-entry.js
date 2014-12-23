var fs = require("fs");
var vm = require("vm");
var logger = require("./logger.js");


function exportables(modulePath) {
    logger.info("exportables");
    logger.info(modulePath);

    var jsdom = require("jsdom").jsdom;
    var document = jsdom("hello world");
    var scriptContext = document.parentWindow;

    var initialGlobals = Object.keys(scriptContext);

    logger.info(initialGlobals);

    var script = fs.readFileSync(modulePath);

    vm.runInNewContext(script, scriptContext);

    var currentGlobals = Object.keys(scriptContext);

    logger.info(currentGlobals);

    var exportables = currentGlobals.filter(function(module) {
        return initialGlobals.indexOf(module) === -1;
    });

    logger.info(exportables);

    return exportables;
}

module.exports = {
    exportables: exportables
};
