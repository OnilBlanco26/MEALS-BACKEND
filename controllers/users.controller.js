const User = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = new User({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'The user was created succesfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user } = req;

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(user.id)

  res.status(200).json({
    status: 'success',
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
  })
});

const updateUser = catchAsync(async(req, res, next) => {
    const {user} = req;
    const {name, email} = req.body

    const updateUser = await user.update({
        name: name.toLowerCase(),
        email: email.toLowerCase()
    })

    res.status(200).json({
        status: 'success',
        message: 'The user was updated succesfully',
        updateUser
    })
})

const deleteUser = catchAsync(async(req, res , next) => {
    const {user} = req;
    await user.update({status: false})

    res.status(200).json({
        status: 'success',
        message: 'user delete was succesfully',
      });
})

module.exports = {
  createUser,
  login,
  updateUser,
  deleteUser
};
