const express         = require('express')
const router          = express.Router()
const usersController = require('../app/controller/usersController')
const { authenicateUser } = require('../app/middleware/authentication')

router.post('/register', usersController.signup)

router.post('/login', usersController.login)

router.get('/account', authenicateUser, usersController.account)

router.delete('/logout', authenicateUser, usersController.logout)

module.exports = router
