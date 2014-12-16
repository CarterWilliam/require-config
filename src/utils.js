require("es6-shim");

function clone(object) {
    return JSON.parse(JSON.stringify(object));
}

// Extract the 'registry' from a RequireJS instance, giving all defined, explicitly named modules.
function extractRegistry(requirejs) {
    var completeRegistry = Object.keys(clone(registry.s.contexts._.registry));
    return completeRegistry.filter(function(moduleName) {
        return !moduleName.startsWith("_@"); // module maps used by requirejs internally.
    });
}

module.exports = {
    clone: clone,
    extractRegistry: extractRegistry
};
