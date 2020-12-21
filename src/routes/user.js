const express = require('express');

const userRouter = express.Router();

// PostgreSQL database node client
const client = require('../../config/db');

/* eslint-disable consistent-return */
userRouter
  .post('/auth/create-user', async (req, res, next) => {
    const {
      firstname, lastname, password, email, gender, jobRole, department, address,
    } = req.body;
    /* eslint-disable max-len */
    if (!firstname || !lastname || !password || !email || !gender || !jobRole || !department || !address) {
      const error = {
        status: 400,
        message: 'One or more fields have not been filled',
      };
      next(error);
    }
    try {
      const result = await client.query(
        'INSERT INTO Users (firstname, lastname, email, password, gender, jobRole, department, address, isAdmin) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [firstname, lastname, email, password, gender, jobRole, department, address, true],
      );

      const response = {
        status: 'success',
        data: result,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  });

module.exports = userRouter;
