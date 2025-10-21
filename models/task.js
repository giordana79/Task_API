const mongoose = require("mongoose");

const validPriorities = ["bassa", "media", "alta"];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, trim: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: validPriorities, default: "media" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

//Struttura dei dati in MongoDB
//Schema Mongoose con title, completed e priority (variante avanzata). timestamps per createdAt/updatedAt
