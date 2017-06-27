const Log = require('bunyan');
const _ = require('underscore');

const Module = require('module');

const makeLowLogger = (options) => {
    "use strict";
    const opt = options || {};
    const log = Log.createLogger({
        name: opt.name || 'defaultLogger',
        level: opt.level || Log.INFO,
        stream: options.stream || process.stdout
    });


    if (opt.child) {
        return log.child(opt.child);
    }

    return log;
};

const makeHighLogger = (options) => {
    "use strict";
    const opt = options || {};
    const log = Log.createLogger({
        name: opt.name || 'defaultLogger',
        level: opt.level || Log.ERROR,
        stream: options.stream || process.stderr
    });


    if (opt.child) {
        return log.child(opt.child);
    }

    return log;
};

function GenericLoggerManager(options) {
    "use strict";
    this.options = options || {};
    this.lowLogger = makeLowLogger(this.options);
    this.highLogger = makeHighLogger(this.options);

    this.info = (params) => {
        this.lowLogger.info.apply(this.lowLogger, params);
    };

    this.trace = (params) => {
        this.lowLogger.trace.apply(this.lowLogger, params);
    };

    this.fatal = (params) => {
        this.highLogger.fatal.apply(this.highLogger, params);
    };

    this.error = (params) => {
        this.highLogger.error.apply(this.highLogger, params);
    };

    this.debug = (params) => {
        this.lowLogger.debug.apply(this.lowLogger, params);
    };

    this.warn = (params) => {
        this.lowLogger.warn.apply(this.lowLogger, params);
    };
};

function FlowLoggerManager(options)  {
    "use strict";
    this.flowOptions = options || {};
    this.flowOptions.child = {
      logType: 'flow'
    };
    this.generalManager = new GenericLoggerManager(this.flowOptions);

    this.info = (...args) => {
        this.generalManager.info(args);
    };

    this.trace = (...args) => {
        this.generalManager.trace(args);
    };

    this.fatal = (...args) => {
        this.generalManager.fatal(args);
    };

    this.error = (...args) => {
        this.generalManager.error(args);
    };

    this.debug = (...args) => {
        this.generalManager.debug(args);
    };

    this.warn = (...args) => {
        this.generalManager.warn(args);
    };
};

module.exports.flow = (options) => {
    "use strict";
    return new FlowLoggerManager(options);
};

function SecurityLoggerManager(options) {
    "use strict";
    this.flowOptions = options || {};
    this.flowOptions.child = {
        logType: 'security'
    };
    this.generalManager = new GenericLoggerManager(this.flowOptions);

    this.info = (...args) => {
        this.generalManager.info(args);
    };

    this.trace = (...args) => {
        this.generalManager.trace(args);
    };

    this.fatal = (...args) => {
        this.generalManager.fatal(args);
    };

    this.error = (...args) => {
        this.generalManager.error(args);
    };

    this.debug = (...args) => {
        this.generalManager.debug(args);
    };

    this.warn = (...args) => {
        this.generalManager.warn(args);
    };

};

module.exports.security = (options) => {
    "use strict";
    return new SecurityLoggerManager(options);
};

function PerformanceLoggerManager(options) {
    "use strict";
    this.flowOptions = options || {};
    this.flowOptions.child = {
        logType: 'performance'
    };
    this.generalManager = new GenericLoggerManager(this.flowOptions);

    this.info = (...args) => {
        this.generalManager.info(args);
    };

    this.trace = (...args) => {
        this.generalManager.trace(args);
    };

    this.fatal = (...args) => {
        this.generalManager.fatal(args);
    };

    this.error = (...args) => {
        this.generalManager.error(args);
    };

    this.debug = (...args) => {
        this.generalManager.debug(args);
    };

    this.warn = (...args) => {
        this.generalManager.warn(args);
    };

};

module.exports.performance = (options) => {
    "use strict";
    return new PerformanceLoggerManager(options);
};

let Flow = undefined;
let Security = undefined;
let Performance = undefined;
let level = 'info';
let moduleOptions = {};

module.exports.logger = {
    setOptions(options) {
        "use strict";
        moduleOptions = options;
    },

    get flow() {
        "use strict";
        if( Flow == undefined ) {
            Flow = new FlowLoggerManager(moduleOptions);
        }

        return Flow;
    },

    get security() {
        "use strict";
        if(Security == undefined) {
            Security = new SecurityLoggerManager(moduleOptions);
        }

        return Security;
    },


    get performance() {
        "use strict";

        if(Performance == undefined) {
            Performance = new PerformanceLoggerManager(moduleOptions);
        }

        return Performance;

    }
}