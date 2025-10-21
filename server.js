require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const tasksRouter = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./logger");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/taskdb";

app.get("/", (req, res) => {
  res.redirect("/health");
});

// Middlewares
app.use(express.json());

// Morgan usa il logger.stream (che fa logger.info)
app.use(morgan("combined", { stream: logger.stream }));

// Routes
app.use("/api/tasks", tasksRouter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Error handler (ultimo middleware)
app.use(errorHandler);

// Connessione a MongoDB e avvio server
(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connesso a MongoDB");
    app.listen(PORT, () => {
      logger.info(`Server in ascolto su http://localhost:${PORT}`);
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("Errore connessione MongoDB", {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
})();

//Inizializza server e middleware
//Punto d'ingresso: connessione a MongoDB,
//configurazione di Morgan con stream di Winston, uso rotte e error handler
