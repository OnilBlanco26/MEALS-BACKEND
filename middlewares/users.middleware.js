const User = require("../models/users.model");
const AppError = require("../utils/appError");
const jwt = require('jsonwebtoken');
const catchAsync = require("../utils/catchAsync");

const validateUserByEmail = catchAsync(async(req,res,next) => {
    const {email}= req.body

    const user = await User.findOne({
        where: {
            email: email.toLowerCase()
        }
    })


    if (user && !user.status) {
        return next(new AppError('The account sems to be disbaled, talk to the administrator to enable it.'));
    }

    if(user) {
        return next(new AppError('The email has been already exist!'))
    }
    req.user = user;
    next()
})

const validateifExistUserByEmail = catchAsync(async(req,res,next) => {
    const {email} = req.body

    const user = await User.findOne({
        where: {
            email: email.toLowerCase()
        }
    })

    if(!user) {
        return next(new AppError('Incorrect Email or Password', 400))
    }

    req.user = user;
    next()
})

const protect = catchAsync(async (req, res, next) => {
    //1 Verificar que llegue el token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );
    }
  
    //2 Validar token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.SECRET_JWT_SEED
    );
  
    //3 Verificar que el usuario exista
    const user = await User.findOne({
      where: {
        id: decoded.id,
        status: true,
      },
    });
  
    if (!user) {
      return next(
        new AppError('The owner of this token if not longer available', 401)
      );
    }
  
    req.sessionUser = user;
    next();
  });
  
  const protectAccountOwner = catchAsync(async (req, res, next) => {
    // Get user from request
    const { user } = req;
  
    // Get session user from request
    const { sessionUser } = req;
  
    // Check if user is not session user
    if (user.id !== sessionUser.id)
      // If true, throw error
      next(new AppError('You do not own this account', 401));
  
    next();
  });
  
  const restricTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.sessionUser.role)) {
        return next(
          new AppError('You do not have permission to perfom this action. !', 403)
        );
      }
  
      next();
    };
  };

  module.exports = {
    validateUserByEmail,
    validateifExistUserByEmail,
    protect,
    protectAccountOwner,
    restricTo
  }