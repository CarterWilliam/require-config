var fs = require("fs");
var vm = require("vm");

function shimEntry(modulePath) {

    var scriptContext = {};
    var script = fs.readFileSync(modulePath);

    vm.runInNewContext(script, scriptContext);

    var exportables = Object.keys(scriptContext);
    if (exportables.length === 1) {
        return { exports: exportables[0] };
    } else if (exportables.length > 1) {
        return { exports: "WARNING: Mulitple exportables: " + exportables.join(", ") };
    }

}

module.exports = shimEntry;
