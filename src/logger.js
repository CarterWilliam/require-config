var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ json: false, filename: 'logs/require-config.log' })
    ]
});

module.exports = logger;
