const Meal = require("../models/meals.model");
const Restaurant = require('../models/restaurants.model');
const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");

const createMeals = catchAsync(async(req,res,next) => {
    const {name, price} = req.body
    const {id} = req.params

    const restaurant = await Restaurant.findOne({
        where: {
            id,
            status: true
        }
    })

    if(!restaurant) {
        return next(new AppError('The restaurant you are looking for does not exist...'))
    }

    const meal = await Meal.create({
        restaurantId: id,
        name,
        price
    })

    res.status(201).json({
        status: 'success',
        message: 'The meal has been created correctly',
        meal: {
            id,
            restaurantId: id,
            name,
            price
        }
    })
    
})


module.exports = {
    createMeals
}