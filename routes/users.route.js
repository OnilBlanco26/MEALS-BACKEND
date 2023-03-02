const {Router} = require('express')
const { check } = require('express-validator')
const { createUser, login, updateUser, deleteUser } = require('../controllers/users.controller')
const { validateUserByEmail, validateifExistUserByEmail } = require('../middlewares/users.middleware')
const { validateFields } = require('../middlewares/validateField.middleware')

const router = Router()

router.post('/signup', [
    check('name', 'The username must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The passwrod must be mandatory').not().isEmpty(),
    validateUserByEmail,
    validateFields,
], createUser)

router.post('/login',[
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'Must be in email format').isEmail(),
    check('password', 'The password must be mandatory').not().isEmpty(),
    validateifExistUserByEmail,
    validateFields
] ,login)

router.patch('/:id', updateUser)

router.delete('/:id', deleteUser)

// router.get('/orders', getOrders)

// router.get('/orders/:id', getOrder)

module.exports = {
    usersRouter: router
}