var requirejs = require("requirejs");

// requirejs(["resources/explicitly-named"], function(lib) {
//     console.log("explicitly-named");
//     console.log(lib);
//     console.log(requirejs.s.contexts._.defined);
//     console.log(requirejs.s.contexts._.registry);
// });

// requirejs(["resources/amd"], function(lib) {
//     console.log("amd");
//     console.log(lib);
//     console.log(requirejs.s.contexts._.defined);
//     console.log(requirejs.s.contexts._.registry);
// });

// requirejs(["resources/dependent"], function(lib) {
//     console.log("dependent");
//     console.log(lib);
//     console.log(requirejs.s.contexts._.defined);
//     console.log(requirejs.s.contexts._.registry);
// });

requirejs(["resources/browser-global"], function(lib) {
    console.log("browser-global");
    console.log(lib);
    console.log(requirejs.s.contexts._.defined);
    console.log(requirejs.s.contexts._.registry);

    console.log(browserGlobal);
});
