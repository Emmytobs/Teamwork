const express = require('express');

const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const middleware = require('../middleware/auth');

// PostgreSQL database node client
// const client = require('../../config/db');

/* eslint-disable consistent-return */
userRouter.use(middleware.hashPassword);
userRouter.post('/auth/create-user', userController.registerUser);

module.exports = userRouter;
