var thing = "thingy";

var vm = require("vm");
var fs = require("fs");

var scriptContext = {};

var script = fs.readFileSync("/Users/cartew01/workspace/require-config/resources/browser-global.js");

vm.runInNewContext(script, scriptContext);
// console.log(x);
console.log(scriptContext);
