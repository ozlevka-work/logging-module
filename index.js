const Log = require('bunyan');
const _ = require('underscore');


const legal_log_levels = {
    trace: Log.TRACE,
    debug: Log.DEBUG,
    info: Log.INFO,
    warn: Log.WARN,
    error: Log.ERROR,
    fatal: Log.FATAL
};

// See documentation on bunyan streams here: https://www.npmjs.com/package/bunyan#streams

function MyStream(stream) {
    this.stream = stream;
    this.logLimitBytes = -1;

    if ('fd' in stream && (stream.fd === 1 /* stdout */ || stream.fd === 2 /* stderr */ )) {
        // std is limitted to 64 KBytes (65536 bytes) by bufio maximum buffer size
        // see 'MaxScanTokenSize’ in https://golang.org/pkg/bufio/#Scanner.Buffer
        // Limit our logger to 60 KBytes
        this.logLimitBytes = 60 * 1024;
    }
}

MyStream.prototype.write = function (logStr) {
    // string.length returns the number of characters in the string.
    // we need to ansure the number of bytes in the string.

    let logIt = false;
    let logBuf;
    let logLenBytes;
    let logLenChars = logStr.length;
    
    if (this.logLimitBytes === -1) {
        logIt = true;
    }
    else if ((logLenChars * 4) <= this.logLimitBytes) {
        // maximum number of bytes a single character can take is 4
        logIt = true;
    }
    else {
        // need to calculate the actuall number of bytes in the string
        logBuf = Buffer.from(logStr);
        logLenBytes = logBuf.length;
        if (logLenBytes <= this.logLimitBytes) {
            logIt = true;
        }
    }

    if (logIt === true) {
        this.stream.write(logStr);
        return;
    }

    try {
        // write a 'raw' log to stderr

        let newLogStr = logBuf.toString('utf8', 0, this.logLimitBytes);
        let logJson = JSON.parse(logStr);

        let newLogJson = {
            level: 60,  // fatal
            hostname: logJson.hostname,
            logType: logJson.logType,
            logSystemID: logJson.logSystemID,
            name: logJson.name,
            pid: logJson.pid,
            v: logJson.v,
            time: logJson.time,
            //msg: `[**** LOG TRUNCATED. ORIGINAL BYTES LENGTH ${logLenBytes} (${logLenChars} CHARACTERS) ****] : ${newLogStr}`
            msg: "EYAL !!!!!!!!!!!!!!!!!!!1"
        }

        console.log("begin writing truncated log!")
        console.log("new !!!!!!!!!! new")
        let levLog = JSON.stringify(newLogJson);
        levLog += "\n";
        //console.log(levLog)
        process.stderr.write(levLog);
        console.log("end writing truncated log!")
    }
    catch (err) {
        console.log("error writing truncated log")
        process.stderr.write(`Failed handling too long log message: ${err.message}`);
    }
}

const makeLowLogger = (options) => {
    "use strict";
    const opt = options || {};
    const log = Log.createLogger({
        name: opt.name || 'defaultLogger',
        streams: [{
            level: checkLevelExists(opt.level) || Log.INFO,
            type: 'stream',
            stream: new MyStream(options.stream || process.stdout)
        }]
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
        streams: [{
            level: checkLevelExists(opt.level) || Log.ERROR,
            type: 'stream',
            stream: new MyStream(options.stream || process.stderr)
        }]
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

function ReportLoggerManager(stream) {
    "use strict";
    this.generalManager = undefined;
    if(stream) {
        this.generalManager = new GenericLoggerManager({name: 'Report', level: 'info', stream: stream, child: {logType: 'report'}})
    } else {
        this.generalManager = new GenericLoggerManager({name: 'Report', level: 'info', child: {logType: 'report'}});
    }


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