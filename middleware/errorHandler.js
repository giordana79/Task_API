const logger = require("../logger");

function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  // Log dettagliato
  logger.error("Errore interno", { message: err.message, stack: err.stack });

  //res.headersSent check
  if (res.headersSent) {
    return next(err);
  }

  // Errori comuni: cast error di mongoose (id invalid), validation, etc.
  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID non valido" });
  }

  // default
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;

//Gestisce e logga errori
//Middleware per error handling centralizzato; log con logger
