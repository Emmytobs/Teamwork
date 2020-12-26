/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */

// PostgreSQL database node client
const client = require('../../config/db');
const { generateToken, generateRandomPassword } = require('../middleware/auth');
const httpResponseHandler = require('../response_handler');

function userController() {
  const registerUser = async (req, res, next) => {
    const {
      firstname, lastname, password, email, gender, jobrole, department, address, isadmin,
    } = req.body;
    /* eslint-disable max-len */
    if (!firstname || !lastname || !password || !email || !gender || !jobrole || !department || !address || !isadmin) {
      /* eslint-disable no-restricted-syntax */
      // Helps to know what field is missing
      for (const i of Object.values(req.body)) {
        console.log(i);
      }
      const error = {
        status: 'Error',
        message: 'All fields are required',
      };
      return httpResponseHandler.error(res, 400, error);
    }
    try {
      const { hashedPassword } = req;
      const result = await client.query(
        'INSERT INTO users (firstname, lastname, email, password, gender, jobrole, department_id, address, isadmin) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        // department being injected MUST BE A NUMBER REFERENCING THE PK OF THE DEPARTMENTS TABLE
        [firstname, lastname, email, hashedPassword, gender, jobrole, department, address, isadmin],
      );
      const { user_id, firstname: storedFirstname, lastname: storedLastname } = result.rows[0]; // eslint-disable-line 
      const token = generateToken({ user_id, storedFirstname, storedLastname });

      delete result.rows[0].password;
      const response = {
        status: 'success',
        data: {
          ...result.rows[0],
          token,
        },
      };
      return httpResponseHandler.success(res, 201, response);
    } catch (error) {
      next(error);
    }
  };

  const createEmployeeUser = async (req, res, next) => {
    const {
      firstname, lastname, email, gender, jobrole, department, address, profilePic,
    } = req.body;
    /* eslint-disable max-len */
    if (!firstname || !lastname || !email || !gender || !jobrole || !department) {
      /* eslint-disable no-restricted-syntax */
      // Helps to know what field is missing
      for (const i of Object.values(req.body)) {
        console.log(i);
      }
      const error = {
        status: 'Error',
        message: 'All fields are required',
      };
      return httpResponseHandler.error(res, 400, error);
    }
    try {
      let randomPassword = generateRandomPassword();
      randomPassword = `auto_${randomPassword}`;

      const result = await client.query(
        'INSERT INTO users (firstname, lastname, email, password, gender, jobrole, department_id, address, profile_pic, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [firstname, lastname, email, randomPassword, gender, jobrole, department, address, profilePic, 'NOW()'],
        );
      const newUser = result.rows[0];
      const token = generateToken({ user_id: newUser.user_id, firstname: newUser.firstname, lastname: newUser.lastname });

      delete result.rows[0].password;
      const response = {
        status: 'success',
        data: {
          user: {
            ...result.rows[0],
          },
          token,
        },
      };
      httpResponseHandler.success(res, 201, response);
    } catch (error) {
      next(error);
    }
  };

  return {
    registerUser,
    createEmployeeUser
  };
}

module.exports = userController();
