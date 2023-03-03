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

const getAllMeals = catchAsync(async(req,res,next) => {
    const meals = await Meal.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'status', 'restaurantId']},
        where: {
            status: true
        },
        include: [
            {
                model: Restaurant,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'status']
                }
            }
        ]
    })

    if(meals.length === 0) {
        return next(new AppError('No meals found in the list', 400))
    }

    res.status(200).json({
        status: 'success',
        message: 'Here is the list with all the meals',
        meals
    })
})

const findMealById = catchAsync(async(req, res,next) => {
    const {meal} = req;

    res.status(200).json({
        status: 'success',
        message: 'Here are the meals you are looking for',
        meal
    })
})

const updateMeals = catchAsync(async(req, res, next) => {
    const {meal} = req;
    const {name, price} = req.body

    const updateMeal = await meal.update({
        name,
        price
    })

    res.status(200).json({
        status: 'success',
        message: 'The meal was updated succesfully',
        updateMeal
    })

})

const deleteMeals = catchAsync(async(req, res, next) => {
    const {meal} = req

    await meal.update({status: false})

    res.status(200).json({
        status: 'success',
        message: 'The meal has been successfully deleted'
    })

})


module.exports = {
    createMeals,
    getAllMeals,
    findMealById,
    updateMeals,
    deleteMeals
}