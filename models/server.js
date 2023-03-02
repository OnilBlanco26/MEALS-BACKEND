const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.port = 3000;

    this.paths = {
      users: '/api/v1/users',
      orders: '/api/v1/orders',
      restaurants: '/api/v1/restaurants',
      meals: '/api/v1/meals',
      reviews: '/api/v1/reviews',
    };
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());
  }

  routes() {

  }

  database() {
    
  }

  listen() {
    this.app.listen(this.port, () => {
        console.log('Server running on port ', this.port)
    })
  }
}


module.exports = Server