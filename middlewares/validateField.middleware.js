// Importar el paquete express-validator
const { validationResult } = require('express-validator');

// Crear una función middleware para validar los campos
const validateFields = (req, res, next) => {
  // Obtener los errores de la solicitud
  const errors = validationResult(req);

  // Si hay errores
  if (!errors.isEmpty()) {
    // Enviar el estado y los errores
    res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }
  // Si no hay errores, continúe
  next();
};

// Exportar la función middleware
module.exports = {
  validateFields,
};
