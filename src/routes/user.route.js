const express = require('express');

const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const middleware = require('../middleware/auth');

// PostgreSQL database node client
// const client = require('../../config/db');

/* eslint-disable consistent-return */
userRouter.use('/auth/create-user', middleware.hashPassword);
userRouter.post('/auth/create-user', userController.registerUser);

userRouter.post('/create-employee-user', userController.createEmployeeUser);

userRouter.post('/login', userController.loginUser);

userRouter.use('/update-user-data', middleware.authenticateUser);
userRouter.put('/update-user-data', userController.updateUserData);

userRouter.get('/user-token/verify', userController.verifyUserToken);

module.exports = userRouter;
