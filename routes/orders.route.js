const { Router } = require("express");
const { check } = require("express-validator");
const { createOrder } = require("../controllers/orders.controller");
const { protect } = require("../middlewares/users.middleware");
const { validateFields } = require("../middlewares/validateField.middleware");

const router =new Router()



router.post('/',
[
    check('quantity', 'The quantity must be mandatory').not().isEmpty(),
    check('quantity', 'The quantity must be a numeric').isNumeric(),
    check('mealId', 'The mealId must be a numeric').not().isEmpty(),
    validateFields,
    protect
]
,createOrder)

module.exports = {
    ordersRouter: router
}