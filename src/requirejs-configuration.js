var RequireConfig = function() {

    this.config = {
    	paths: {},
    	shim: {}
    };

}

RequireConfig.prototype.addBaseUrl = function(url) {
    this.config.baseUrl = url;
}

RequireConfig.prototype.addPath = function(moduleName, path) {

    path = !path.startsWith("http") && path.endsWith(".js") ? path.slice(0, -3) : path;
	this.config.paths[moduleName] = path;
};

RequireConfig.prototype.addShimEntry = function(moduleName, exportables) {

    if (exportables.length === 1) {
        this.config.shim[moduleName]  = { exports: exportables[0] };
    } else if (exportables.length > 1) {
        this.config.shim[moduleName] = { exports: "WARNING: Multiple exportables: " + exportables.join(", ") };
    }

};

RequireConfig.prototype.toString = function() {
    return JSON.stringify(this.config, undefined, 4);
};

module.exports = RequireConfig;
