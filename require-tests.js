var requirejs = require("requirejs");

requirejs(["resources/angular-moment"], function(lib) {
    console.log("explicitly-named");
    console.log(lib);
    console.log(requirejs.s.contexts._.defined);
    console.log(requirejs.s.contexts._.registry);
});

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

// requirejs(["resources/browser-global"], function(lib) {
//     console.log("browser-global");
//     console.log(lib);
//     console.log(requirejs.s.contexts._.defined);
//     console.log(requirejs.s.contexts._.registry);
//
//     console.log(browserGlobal);
// });

// console.log(require("./resources/browser-global"));
//
// console.log(requirejs(["resources/browser-global"]));
