const { Router } = require("express");
const { createRestaurant } = require("../controllers/restaurants.controller");

const router = new Router()

router.post('/', createRestaurant)


module.exports = {
    restaurantsRouter: router
}