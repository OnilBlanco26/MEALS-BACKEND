const {Router} = require('express')
const { createUser } = require('../controllers/users.controller')

const router = Router()

router.post('/signup', createUser)

// router.post('/login', login)

// router.patch('/:id', updateUser)

// router.delete('/:id', deleteUser)

// router.get('/orders', getOrders)

// router.get('/orders/:id', getOrder)

module.exports = {
    usersRouter: router
}