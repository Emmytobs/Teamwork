/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

// PostgreSQL database node client
const bcrypt = require('bcryptjs');

const client = require('../../config/db');
const sendEmail = require('../middleware/sendEmail');

const { generateToken, generateRandomPassword, hashPassword } = require('../middleware/auth');

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
      const token = generateToken({
        user_id: newUser.user_id, firstname: newUser.firstname, email: newUser.email, departmentId: newUser.department_id,
      });

      // Send email to employee user
      const emailTransportMessage = await sendEmail(randomPassword, newUser.email, newUser.firstname);

      delete result.rows[0].password;
      const response = {
        status: 'success',
        data: {
          message: 'User account successfully created',
          emailTransportMessage,
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

  const loginUser = async (req, res, next) => {
    try {
      const result = await client.query('SELECT * FROM users WHERE email=$1', [req.body.email]);
      if (!result.rows.length) {
        const error = {
          status: 'error',
          message: 'Incorrect email or password',
        };
        return httpResponseHandler.error(res, 404, error);
      }
      // Check if password is correct
      const { password: passwordInDb } = result.rows[0];
      let isEqual;
      if (passwordInDb.includes('auto')) {
        isEqual = req.body.password === passwordInDb;
      } else {
        isEqual = await bcrypt.compare(req.body.password, passwordInDb);
      }

      if (!isEqual) {
        const error = {
          status: 'error',
          message: 'Incorrect email or password',
        };
        return httpResponseHandler.error(res, 404, error);
      }

      delete result.rows[0].password;
      // Generate JWT
      const {
        user_id, firstname, email, departmentId,
      } = result.rows[0];
      const token = generateToken({
        user_id, firstname, email, departmentId,
      });
      const response = {
        status: 'success',
        data: {
          message: 'Log in successful',
          user: {
            ...result.rows[0],
          },
          token,
        },
      };
      return httpResponseHandler.success(res, 200, response);
    } catch (error) {
      next(error);
    }
  };

  const updateUserData = async (req, res, next) => {
    let query = `UPDATE users `; // eslint-disable-line quotes
    const variables = [];

    const updateList = Object.keys(req.body);
    const forbiddenUpdate = updateList.find((update) => update === 'user_id' || update === 'isadmin' || update === 'created_at');
    if (forbiddenUpdate) {
      const error = {
        status: 'error',
        message: 'Invalid update!',
      };
      return httpResponseHandler.error(res, 400, error);
    }

    try {
      const containsPasswordUpdate = updateList.includes('password');
      if (containsPasswordUpdate) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
  
      updateList.forEach((key, index) => {
        if (index === updateList.length - 1) {
          query += `SET ${key} = $${index + 1} WHERE user_id = ${req.user.userId} RETURNING *`;
          variables.push(req.body[key]);
          return;
        }
        query += `SET ${key} = $${index + 1}, `;
        variables.push(req.body[key]);
      });
  
      const result = await client.query(query, variables);
      res.json(result.rows);
    } catch (error) {
      next(error)
    }
  };

  return {
    registerUser,
    createEmployeeUser,
    loginUser,
    updateUserData,
  };
}

module.exports = userController();
