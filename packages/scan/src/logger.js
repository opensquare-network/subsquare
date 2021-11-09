const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";

const scanFileCategory = "block-scan";
const businessCategory = "business";
const blockFileCategory = "block";
const metaFileCategory = "meta";

log4js.configure({
  appenders: {
    [scanFileCategory]: { type: "file", filename: `log/scan.log` },
    [businessCategory]: { type: "file", filename: `log/bus.log` },
    [blockFileCategory]: { type: "file", filename: `log/block.log` },
    [metaFileCategory]: { type: "file", filename: `log/meta.log` },
    errorFile: {
      type: "file",
      filename: `log/errors.log`,
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile",
    },
    out: { type: "stdout" },
  },
  categories: {
    default: {
      appenders: [isProduction ? scanFileCategory : "out", "errors"],
      level: logLevel,
    },
    [businessCategory]: {
      appenders: [isProduction ? businessCategory : "out", "errors"],
      level: logLevel,
    },
    [blockFileCategory]: {
      appenders: [
        isProduction ? blockFileCategory : "out",
        isProduction ? blockFileCategory : "errors",
      ],
      level: logLevel,
    },
    [metaFileCategory]: {
      appenders: [
        isProduction ? metaFileCategory : "out",
        isProduction ? metaFileCategory : "errors",
      ],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(scanFileCategory);
const busLogger = log4js.getLogger(businessCategory);
const blockLogger = log4js.getLogger(blockFileCategory);
const metaLogger = log4js.getLogger(metaFileCategory);

module.exports = {
  logger,
  busLogger,
  blockLogger,
  metaLogger,
};
