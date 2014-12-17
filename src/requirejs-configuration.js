var RequireConfig = function(baseUrl) {

    this.config = {
    	paths: [],
    	shim: []
    };

    if (baseUrl) {
        this.config.baseUrl = baseUrl;
    }
}

RequireConfig.prototype.addPath = function(moduleName, path) {
	if(moduleName && path){
		this.config.paths.push({module:moduleName, path:path});
	}
};

RequireConfig.prototype.addShimEntry = function(moduleName, exportables) {
	if(moduleName && exportables){
		this.config.shim.push({module:moduleName, exports:exportables});
	}
};

RequireConfig.prototype.toString = function() {
    console.log(JSON.stringify(this.config));
    return JSON.stringify(this.config);
};

module.exports = RequireConfig;

// Example output (current)
/*
{
   "paths":[
      {
         "module":"angular",
         "path":"../bower_components/angular/angular"
      },
      {
         "module":"angular-moment",
         "path":"../bower_components/angular-moment/angular-moment"
      }
   ],
   "shim":[
      {
         "module":"angularRoute",
         "exports":"angular"
      }
   ],
   "baseUrl":"/documents"
}

*/

// Example output (desired)
/*

require.config({
    paths: {
        angular: "../bower_components/angular/angular",
        angularRoute: "../bower_components/angular-route/angular-route",
        moment: "../bower_components/moment/moment",
        "angular-moment": "../bower_components/angular-moment/angular-moment",
        uiBootstrap: "../bower_components/angular-bootstrap/ui-bootstrap-tpls",
        "bump-3": "../libraries/bump-3",
        "embed": "../libraries/embed",
        "jquery-1.9": "../libraries/jquery-1.9",
        "swfobject-2": "../libraries/swfobject-2",
        gantt: "../bower_components/angular-gantt/assets/angular-gantt",
        ganttPlugins: "../bower_components/angular-gantt/assets/angular-gantt-plugins"
    },
    shim: {
        angular: { exports: "angular" },
        angularRoute: ["angular"],
        uiBootstrap: ["angular"],
        gantt: ["angular-moment"],
        ganttPlugins: ["gantt"]
    }
});

*/
