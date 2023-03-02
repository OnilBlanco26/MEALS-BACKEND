const Restaurant = require('../models/restaurants.model')
const Review = require('../models/reviews.model')
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

const createReview = catchAsync(async(req,res,next) => {
    console.log('estoy entrando')
    const {sessionUser} = req;
    const {comment, rating} = req.body
    const {id} = req.params

    if(rating > 5 || rating < 0) {
        return next(new AppError('The rating must be between 0 and 5', 400))
    }

    const newReview = await Review.create({
        userId: sessionUser.id,
        comment,
        restaurantId: id,
        rating
    })

    console.log(newReview)

    res.status(200).json({
        status: 'success',
        message: 'The Review was created succesfully',
        newReview
    })
})

const updateReview = catchAsync(async(req,res,next) => {
    const {sessionUser} = req;
    const {restaurantId, id} = req.params 
    const {comment, rating} = req.body 

    const restaurant = await Restaurant.findOne({
        where: {
            id: restaurantId,
            status: true
        }
    })

    if(!restaurant) {
        return next(new AppError('Restaurant not found', 400))
    }

    const review = await Review.findOne({
        where: {
            id,
            userId: sessionUser.id,
            restaurantId,
            status: 'active'
        }
    })

    if(!review) {
        return next(new AppError('Review not found', 400))
    }

    const updateR = await review.update({
        comment,
        rating
    })

    res.status(200).json({
        status: 'success',
        message: 'The review has been updated correctly',
        updateR
    })
})

module.exports = {
    createRestaurant,
    getAllRestaurants,
    findRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    createReview,
    updateReview
}