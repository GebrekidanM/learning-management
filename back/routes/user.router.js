const {createForOneTimeUser,UserLogIn,LoggedUser,UserLogOut} = require('../controller/User.controller')
const router = require('express').Router()

//create one new user only for the first time
router.get('/user/createOne',createForOneTimeUser)
//for user Login
router.post('/user/',UserLogIn)
//getInformation of logged User
router.get('/user/profile',LoggedUser)
// for logout
router.get('/user/logout',UserLogOut)

module.exports = router
