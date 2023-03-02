// MANEJO DE ERRORES

const AppError = require('../utils/appError');

//Este método es llamado cuando se ha detectado que se trata de un error de tipo 22P02, lo cual significa que se ha intentado insertar un dato no válido en la base de datos
//Por ejemplo, si se intenta insertar un valor de tipo "string" en una columna "integer" de la base de datos
//Este método devuelve un objeto AppError que contiene el mensaje de error y el código de error
const handleCastError22P02 = () => {
  const message = `Some type of data is invalid`;
  return new AppError(message, 400);
};

// handleJWTError() es un gestor de errores personalizado que se utiliza cuando el token de un usuario no es válido o ha caducado.
// handleJWTError() es llamada cuando el error es capturado en el middleware del manejador de errores global.
const handleJWTError = () => {
  return new AppError('Invalid Token. Please login again!', 401);
};

// esta función crea un nuevo AppError con un mensaje y código de estado para cuando el token JWT ha expirado.
const handleJWTExpiredError = () =>
  new AppError('Your TOKEN has expired! Please login again.', 401);

// sendErrorDev es una función que toma dos parámetros: err y res
// establece el código de estado de la respuesta al código de estado del error
// y envía un objeto json que contiene el estado del error, el mensaje y el stack trace
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err.status,
    message: err.message,
    stack: err.stack,
  });
};

// Esta función gestiona todos los errores operativos en modo producción enviando
// una respuesta al cliente con el código de estado y el mensaje del error.
// En errores no operativos, registra el error en la consola y envía
// un mensaje de error genérico al cliente.
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR 💥', err);

    res.status(500).json({
      error: 'fail',
      message: 'Something went wrong',
    });
  }
};

// globalErrorHandler() maneja los errores que ocurren en la aplicación.
// Si la aplicación se está ejecutando en modo desarrollo, enviará los detalles del error.
// Si la aplicación se está ejecutando en modo producción, sólo enviará el mensaje de error.
// Si el error es un CastError de mongoose, enviará un mensaje de error personalizado.
// Si el error es un JsonWebTokenError, enviará un mensaje de error personalizado.
// Si el error es un TokenExpiredError, enviará un mensaje de error personalizado.
// El manejador de errores es usado como una función middleware, por lo que tiene acceso a los objetos req, res y next.
// El manejador de errores es llamado cuando un error es pasado a next().
// El manejador de errores es llamado con el objeto error como argumento, por lo que el primer argumento es el objeto error.
// El manejador de errores es llamado con los objetos req y res como argumentos, por lo que el segundo y tercer argumento son los objetos req y res.
// El manejador de errores es llamado con la función next() como argumento, por lo que el cuarto argumento es la función next().
// El manejador de errores es llamado con la propiedad error.statusCode, por lo que la propiedad error.statusCode es establecida a la variable statusCode.
// El manejador de errores es llamado con la propiedad error.status, por lo que la propiedad error.status se establece a la variable status.
// Si la aplicación se está ejecutando en modo desarrollo, se llama a la función sendErrorDev() con el objeto error y el objeto res como argumentos, por lo que el objeto error y el objeto res se pasan a la función sendErrorDev().
// Si la aplicación se está ejecutando en modo producción, el objeto error se asigna a la variable error.
// Si el objeto de error no tiene un objeto padre o el objeto de error no tiene un objeto padre con una propiedad code, entonces el objeto de error se asigna a la variable error.
// Si el objeto de error tiene un objeto padre con una propiedad code igual a '22P02', se llama a la función handleCastError22P02() con el objeto de error como argumento, por lo que el objeto de error se pasa a la función handleCastError22P02().
// Si el objeto de error tiene una propiedad name que es igual a 'JsonWebTokenError', se llama a la función handleJWTError() con el objeto de error como argumento, por lo que el objeto de error se pasa a la función handleJWTError().
// Si el objeto de error tiene una propiedad name que es igual a 'TokenExpiredError', se llama a la función handleJWTExpiredError() con el objeto de error como argumento, por lo que el objeto de error se pasa a la función handleJWTExpiredError().
// La función sendErrorProd() se llama con el objeto error y el objeto res como argumentos, por lo que el objeto error y el objeto res se pasan a la función sendErrorProd().

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (!error.parent?.code) {
      error = err;
    }
    if (error.parent?.code === '22P02') error = handleCastError22P02(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
