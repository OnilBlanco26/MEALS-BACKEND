const Restaurant = require('../models/restaurants.model')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const createRestaurant = catchAsync(async(req,res,next) => {
    const {name, address, rating} = req.body

    if(rating > 5  || rating < 0) {
        return next(new AppError('Rating must be between 0 and 5'))
    }

    const newRestaurant = await Restaurant.create({
        name: name.toLowerCase(),
        address,
        rating
    })

    res.status(201).json({
        status: 'success',
        message: 'The Restaurant has been created succesfully',
        newRestaurant
    })
})

module.exports = {
    createRestaurant
}