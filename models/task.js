const mongoose = require("mongoose");

// Definizione schema con timestamp automatici
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["bassa", "media", "alta"],
      default: "media",
    },
  },
  {
    timestamps: true, // genera automaticamente createdAt e updatedAt
  }
);

// ✅ Personalizzazione del JSON in uscita
taskSchema.set("toJSON", {
  transform: (doc, ret) => {
    // Rinomina _id in id
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // Formatta le date in locale IT
    if (ret.createdAt) {
      ret.createdAt = new Date(ret.createdAt).toLocaleString("it-IT", {
        timeZone: "Europe/Rome",
      });
    }
    if (ret.updatedAt) {
      ret.updatedAt = new Date(ret.updatedAt).toLocaleString("it-IT", {
        timeZone: "Europe/Rome",
      });
    }

    return ret;
  },
});

module.exports = mongoose.model("Task", taskSchema);
