const log4js = require("log4js");
const { CHAINS } = require("./env");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";
const chain = process.env.CHAIN || CHAINS.KARURA;

const scanFileCategory = "block-scan";
const businessCategory = "business";

log4js.configure({
  appenders: {
    [scanFileCategory]: { type: "file", filename: `log/${chain}/scan.log` },
    [businessCategory]: { type: "file", filename: `log/${chain}/bus.log` },
    errorFile: {
      type: "file",
      filename: `log/${chain}/errors.log`,
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
  },
});

const logger = log4js.getLogger(scanFileCategory);
const busLogger = log4js.getLogger(businessCategory);

module.exports = {
  logger,
  busLogger,
};
