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

const getAllRestaurants = catchAsync(async(req, res, next) => {
    const restaurants = await Restaurant.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'status']},
        where: {
            status: true
        }
    })

    if(restaurants.length === 0) {
        return next(new AppError('No restaurants found in the list'))
    }

    res.status(200).json({
        status: 'success',
        message: "Here is the list of all restaurants",
        restaurants
    })
})
 
const findRestaurantById = catchAsync(async(req, res, next) => {
    const {restaurant} = req

    res.status(201).json({
        status: 'success',
        message: 'The restaurant was found successfully',
        restaurant
    })
})

const updateRestaurant = catchAsync(async(req, res, next) => {
    const {restaurant} = req;
    const {name, address} = req.body

    const updateRestaurant = await restaurant.update({
        name,
        address
    })

    res.status(200).json({
        status: 'success',
        message: 'The restaurant was updated succesfully',
        updateRestaurant
    })


}) 

const deleteRestaurant = catchAsync(async(req, res, next) => {
    const {restaurant} = req

    await restaurant.update({status: false})

    res.status(200).json({
        status: 'success',
        message: 'The restaurant has been successfully deleted'
    })

})

module.exports = {
    createRestaurant,
    getAllRestaurants,
    findRestaurantById,
    updateRestaurant,
    deleteRestaurant
}