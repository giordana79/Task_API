const Joi = require("joi");

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      //stripUnknown: true rimuove campi extra indesiderati
      stripUnknown: true,
    });
    if (error) {
      const details = error.details.map((d) => d.message);
      return res.status(400).json({ message: "Validation error", details });
    }
    req.body = value;
    next();
  };
}

module.exports = { validateBody };

//Controlla i dati in input
//Middleware generico che prende uno schema Joi e valida req.body
