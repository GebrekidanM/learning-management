const {createForOneTimeUser,forgotPassword} = require('../controller/User.controller')
const forgotPasswordLimiter = require('../middleware/forgotPasswordLimiter')
const upload = require('../upload')
const router = require('express').Router()

router.get('/user/createOne',createForOneTimeUser)
router.post('/user/forgot-password', forgotPasswordLimiter, forgotPassword);

module.exports = router
