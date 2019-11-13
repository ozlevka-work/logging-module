const Log = require('bunyan');
const _ = require('underscore');

const CLUSTER_DEF_SYSTEM_ID = "11111111-1111-1111-1111-111111111111";

const legal_log_levels = {
    trace: Log.TRACE,
    debug: Log.DEBUG,
    info: Log.INFO,
    warn: Log.WARN,
    error: Log.ERROR,
    fatal: Log.FATAL
};

const makeLowLogger = (options) => {
    "use strict";
    const opt = options || {};
    const log = Log.createLogger({
        name: opt.name || 'defaultLogger',
        level: checkLevelExists(opt.level) || Log.INFO,
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
        level: checkLevelExists(opt.level) || Log.ERROR,
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
      logType: 'flow',
      logSystemID: process.env.CLUSTER_SYSTEM_ID || CLUSTER_DEF_SYSTEM_ID
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

function ReportLoggerManager(stream) {
    "use strict";
    let options = {
        name: 'Report', 
        level: 'info', 
        child: {
            logType: 'report',
            logSystemID: process.env.CLUSTER_SYSTEM_ID || CLUSTER_DEF_SYSTEM_ID
        }
    }

    if (stream) {
        options.stream = stream;
    }

    this.generalManager = new GenericLoggerManager(options);

    this.report = (...args) => {
        this.generalManager.info(args);
    }
}

module.exports.flow = (options) => {
    "use strict";
    return new FlowLoggerManager(options);
};

function SecurityLoggerManager(options) {
    "use strict";
    this.flowOptions = options || {};
    this.flowOptions.child = {
        logType: 'security',
        logSystemID: process.env.CLUSTER_SYSTEM_ID || CLUSTER_DEF_SYSTEM_ID
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
        logType: 'performance',
        logSystemID: process.env.CLUSTER_SYSTEM_ID || CLUSTER_DEF_SYSTEM_ID
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

/**
 * Check if level is exists if not return empty.
 * Then logger will be created with INFO level
 * @param level => bunyan log level
 */
const checkLevelExists = (level) => {
    "use strict";
    let log_level = undefined;
    if(typeof level === 'string') {
        log_level = _.filter(Object.keys(legal_log_levels), (l) => {
            return level.toLowerCase() === l;
        });
    }

    if(typeof level === 'number') {
        log_level = _.filter(_.values(legal_log_levels), (ln) => {
            return ln === level;
        });
    }

    if(Array.isArray(log_level) && log_level.length > 0) {
        return log_level[0];
    }

    if(Array.isArray(log_level)) {
        return undefined;
    }

    return log_level;
};

let Flow = undefined;
let Security = undefined;
let Performance = undefined;
let Reports = undefined;
let moduleOptions = {};

module.exports.logger = {
    setOptions(options) {
        "use strict";
        moduleOptions.flowOptions = options;
        moduleOptions.securityOptions = options;
        moduleOptions.performanceOptions = options;
        Flow = undefined;
        Security = undefined;
        Performance = undefined;
        if(options.stream) {
            moduleOptions.stream = options.stream;
            Reports = undefined;
        }
    },

    setFlowOptions(options) {
        "use strict";
        moduleOptions.flowOptions = options;
        Flow = undefined;
    },

    setPerformanceOptions(options) {
        "use strict";
        moduleOptions.performanceOptions = options;
        Performance = undefined;
    },


    setSecurityOptions(options) {
        "use strict";
        moduleOptions.securityOptions = options;
        Security = undefined;
    },


    get flow() {
        "use strict";
        if( Flow == undefined ) {
            Flow = new FlowLoggerManager(moduleOptions.flowOptions);
        }

        return Flow;
    },

    get security() {
        "use strict";
        if(Security == undefined) {
            Security = new SecurityLoggerManager(moduleOptions.securityOptions);
        }

        return Security;
    },


    get performance() {
        "use strict";

        if(Performance == undefined) {
            Performance = new PerformanceLoggerManager(moduleOptions.performanceOptions);
        }

        return Performance;
    },

    get report() {
        "use strict";
        if(Reports == undefined) {
            Reports = new ReportLoggerManager(moduleOptions.stream);
        }

        return Reports;
    }
};