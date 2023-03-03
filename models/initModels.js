const Meal = require('./meals.model');
const Order = require('./orders.model');
const Review = require('./reviews.model');
const User = require('./users.model');
const Restaurant = require('./restaurants.model');

const initModel = () => {
  User.hasMany(Review);
  Review.belongsTo(User);

  User.hasMany(Order);
  Order.belongsTo(User);

  Meal.hasOne(Order);
  Order.belongsTo(Meal);

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);
};

module.exports = initModel;
