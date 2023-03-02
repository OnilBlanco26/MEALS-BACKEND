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
} = require('../controllers/restaurants.controller');
const { getRestaurantById } = require('../middlewares/restaurants.middleware');
const { protect, restricTo } = require('../middlewares/users.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = new Router();

router.post('/reviews/:id', [
    check('comment', 'The comment must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be mandatory').isNumeric(),
    protect,
    getRestaurantById,
    validateFields,
    restricTo('admin')
  ], createReview)


router.post(
  '/',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('address', 'The address must be mandatory').not().isEmpty(),
    validateFields,
    protect,
    restricTo('admin')
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
    restricTo('admin')
  ],
  updateRestaurant
);

router.delete('/:id', getRestaurantById, deleteRestaurant, restricTo('admin'));

router.patch('/reviews/:restaurantId/:id', [
    check('comment', 'The comment must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be mandatory').not().isEmpty(),
    check('rating', 'The rating must a numeric').isNumeric(),
    validateFields,
    restricTo('admin')
] ,updateReview)

module.exports = {
  restaurantsRouter: router,
};
