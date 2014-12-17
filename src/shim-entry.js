var fs = require("fs");
var vm = require("vm");

function exportables(modulePath) {
    var scriptContext = {};
    var script = fs.readFileSync(modulePath);

    vm.runInNewContext(script, scriptContext);

    return Object.keys(scriptContext);
}

module.exports = {
    exportables: exportables
};
