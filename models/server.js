const { rateLimit } = require('express-rate-limit');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { usersRouter } = require('../routes/users.route');
const { db } = require('../database/db');
const { default: helmet } = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const globalErrorHandler = require('../controllers/error.controller');
const AppError = require('../utils/appError');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.limiter = rateLimit({
      max: 100,
      windowMs: 15 * 60 * 1000,
      message: 'Too many request from this IP, please try again in 15 minutes',
    });
    this.paths = {
      users: '/api/v1/users',
      orders: '/api/v1/orders',
      restaurants: '/api/v1/restaurants',
      meals: '/api/v1/meals',
      reviews: '/api/v1/reviews',
    };

    this.database();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(hpp());

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use('/api/v1', this.limiter)

    this.app.use(cors());

    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.users, usersRouter);

    this.app.all('*', (req, res, next) => {
        return next(
          new AppError(`Can't FIND ${req.originalUrl} on this server!`, 404)
        );
      });
  
      this.app.use(globalErrorHandler);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticate'))
      .catch(err => console.log(err));

    db.sync()
      .then(() => console.log('database synced'))
      .catch(err => console.log(err));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server running on port ', this.port);
    });
  }
}

module.exports = Server;
