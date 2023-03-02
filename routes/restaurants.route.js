const { Router } = require("express");
const { createRestaurant, getAllRestaurants, findRestaurantById } = require("../controllers/restaurants.controller");
const { getRestaurantById } = require("../middlewares/restaurants.middleware");

const router = new Router()

router.post('/', createRestaurant)

router.get('/', getAllRestaurants)

router.get('/:id', getRestaurantById, findRestaurantById)

router.patch('/:id', updateRestaurant)


module.exports = {
    restaurantsRouter: router
}