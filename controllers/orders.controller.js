const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');
const Order = require('../models/orders.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Sequelize } = require('sequelize');

const createOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { quantity, mealId } = req.body;

  const meal = await Meal.findOne({
    where: {
      id: mealId,
      status: true,
    },
  });

  if (!meal) {
    return next(
      new AppError('The meal you are looking for has not been found.')
    );
  }

  let totalPrice = quantity * meal.price;

  const newOrder = await Order.create({
    mealId,
    userId: sessionUser.id,
    totalPrice,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    message: 'The order has been successfully created',
    newOrder,
  });
});

const getUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'status'],
    },
    where: {
      userId: sessionUser.id,
      [Sequelize.Op.or]: [{ status: 'active' }, { status: 'completed' }],
    },
    include: [
      {
        model: Meal,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'status', 'restaurantId'],
        },
        where: {
          status: true,
        },
        include: [
          {
            model: Restaurant,
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'status'],
            },
            where: {
              status: true,
            },
          },
        ],
      },
    ],
  });

  if (orders.length === 0) {
    return next(new AppError('There are no orders in the list', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Here is the list of orders',
    orders,
  });
});

const updateOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Order.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (order !== null && order.userId !== sessionUser.id) {
    return next(new AppError('This order belongs to another user', 400));
  }

  if (!order) {
    return next(new AppError('Order not found', 400));
  }

  await order.update({ status: 'completed' });

  res.status(200).json({
    status: 'success',
    message: 'The order has been update succesfully',
  });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Order.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (order !== null && order.userId !== sessionUser.id) {
    return next(new AppError('This order belongs to another user cannot remove it', 400));
  }


  if (!order) {
    return next(new AppError('Order not found', 400));
  }

  await order.update({status: 'cancelled'})

  res.status(200).json({
    status: 'success',
    message: 'The order has been deleted succesfully'
  })
});

module.exports = {
  createOrder,
  getUserOrders,
  updateOrder,
  deleteOrder
};
