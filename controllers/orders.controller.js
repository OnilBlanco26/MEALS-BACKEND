const Meal = require('../models/meals.model');
const Order = require('../models/orders.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')

const createOrder = catchAsync(async(req, res, next) => {
    const {sessionUser} = req; 
    const {quantity, mealId} = req.body

    const meal = await Meal.findOne({
        where: {
            id: mealId,
            status: true
        }
    })

    if(!meal) {
        return next(new AppError('The meal you are looking for has not been found.'))
    }

    let totalPrice = quantity * meal.price

    const newOrder = await Order.create({
        mealId,
        userId: sessionUser.id,
        totalPrice,
        quantity
    })  

    res.status(201).json({
        status: 'success',
        message: 'The order has been successfully created',
        newOrder
    })
})


module.exports = {
    createOrder
}