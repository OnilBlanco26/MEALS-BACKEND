const { Router } = require("express");
const { check } = require("express-validator");
const { createMeals, getAllMeals, findMealById, updateMeals, deleteMeals } = require("../controllers/meals.controller");
const { getMealById } = require("../middlewares/meals.middleware");
const { validateFields } = require("../middlewares/validateField.middleware");


const router = new Router()

router.post('/:id', [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('price', 'The price must be mandatory').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric()
], createMeals)

router.get('/', getAllMeals)

router.get('/:id', getMealById, findMealById)

router.patch('/:id', 
[
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('price', 'The price must be mandatory').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    getMealById,
    validateFields
]
 ,updateMeals)

 router.delete('/:id', getMealById ,deleteMeals)




module.exports = {
    mealsRouter: router
}