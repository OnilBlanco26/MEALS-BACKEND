const { Router } = require('express');
const { check } = require('express-validator');
const {
  createRestaurant,
  getAllRestaurants,
  findRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/restaurants.controller');
const { getRestaurantById } = require('../middlewares/restaurants.middleware');
const { protect, restricTo } = require('../middlewares/users.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = new Router();

//TODO: NOTA: Se pide que todas POST PATCH DELETE solo pueda hacer peticiones un admin pero no le puse restricTo a la parte de review porque no tendria sentido

router.post(
  '/reviews/:id',
  [
    check('comment', 'The comment must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be mandatory').isNumeric(),
    protect,
    getRestaurantById,
    validateFields,
  ],
  createReview
);

router.post(
  '/',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('address', 'The address must be mandatory').not().isEmpty(),
    validateFields,
    protect,
    restricTo('admin'),
  ],
  createRestaurant
);

router.get('/', getAllRestaurants);

router.get('/:id', getRestaurantById, findRestaurantById);

router.use(protect);

router.patch(
  '/:id',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('address', 'The address must be mandatory').not().isEmpty(),
    getRestaurantById,
    validateFields,
    restricTo('admin'),
  ],
  updateRestaurant
);

router.delete('/:id', getRestaurantById,  restricTo('admin'), deleteRestaurant);

router.patch(
  '/reviews/:restaurantId/:id',
  [
    check('comment', 'The comment must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be mandatory').not().isEmpty(),
    check('rating', 'The rating must a numeric').isNumeric(),
    validateFields,
  ],
  updateReview
);

router.delete('/reviews/:restaurantId/:id', deleteReview);

module.exports = {
  restaurantsRouter: router,
};
