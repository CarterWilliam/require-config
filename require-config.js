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
.run();
