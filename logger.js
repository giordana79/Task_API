const path = require("path");
const fs = require("fs");
const { createLogger, format, transports } = require("winston");

const logDir = process.env.LOG_DIR || "logs";
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new transports.File({ filename: path.join(logDir, "combined.log") }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

// stream per morgan
logger.stream = {
  write: (message) => {
    // Morgan adds a newline — rimuoviamola
    logger.info(message.trim());
  },
};

module.exports = logger;

//Centralizza i log applicativi
//Si configura Winston e si fornisce uno stream per Morgan
