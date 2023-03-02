const Restaurant = require('../models/restaurants.model')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const getRestaurantById = catchAsync(async(req ,res, next) => {
    const {id} = req.params

    const restaurant = await Restaurant.findOne({
        attributes: {exclude: ['createdAt', 'updatedAt', 'status']},
        where: {
            id,
            status: true
        }
    })

    if(!restaurant) {
        return next(new AppError('The restaurant you are looking for does not exist'))
    }

    req.restaurant = restaurant;
    next()
})


module.exports = {
    getRestaurantById
}