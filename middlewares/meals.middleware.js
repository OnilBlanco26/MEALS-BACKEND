const Meal = require("../models/meals.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


const getMealById = catchAsync(async(req ,res, next) => {
    const {id} = req.params

    const meal = await Meal.findOne({
        attributes: {exclude: ['createdAt', 'updatedAt', 'status']},
        where: {
            id,
            status: true
        }
    })

    if(!meal) {
        return next(new AppError('The meal you are looking for does not exist'))
    }

    req.meal = meal;
    next()
})


module.exports = {
    getMealById
}