const mongoose = require("mongoose");

function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID non valido" });
  }
  next();
}

module.exports = validateId;
