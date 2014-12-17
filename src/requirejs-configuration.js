var RequireConfig = function(baseUrl) {

    this.config = {};

    if (baseUrl) {
        this.config.baseUrl = baseUrl;
    }
}

RequireConfig.prototype.addPath = function(moduleName, path) {

};

RequireConfig.prototype.shimEntry = function(moduleName, path) {

};

RequireConfig.prototype.toString = function() {
    return "CONFIGURATION";
};

module.exports = RequireConfig;
