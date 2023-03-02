const { Router } = require("express");
const { check } = require("express-validator");
const { createRestaurant, getAllRestaurants, findRestaurantById, updateRestaurant, deleteRestaurant } = require("../controllers/restaurants.controller");
const { getRestaurantById } = require("../middlewares/restaurants.middleware");
const { validateFields } = require("../middlewares/validateField.middleware");

const router = new Router()

router.post('/', createRestaurant)

router.get('/', getAllRestaurants)

router.get('/:id', getRestaurantById, findRestaurantById)

router.patch('/:id', 
[
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('address', 'The address must be mandatory').not().isEmpty(),
    getRestaurantById,
    validateFields
]
 ,updateRestaurant)

 router.delete('/:id', getRestaurantById ,deleteRestaurant)


module.exports = {
    restaurantsRouter: router
}