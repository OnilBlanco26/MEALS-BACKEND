const User = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');

const createUser = catchAsync(async (req, res, next) => {
    const {name, email, password, role} = req.body

    const user = new User({
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        password,
        role
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    const token = await generateJWT(user.id)

    res.status(201).json({
        status: 'success',
        message: 'The user was created succesfully',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
});

module.exports = {
    createUser
};
