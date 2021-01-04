/* eslint-disable consistent-return */

const client = require('../../config/db');
const httpResponseHandler = require('../response_handler');

function departmentController() {
  const fetchDepartments = async (req, res, next) => {
    try {
      const result = await client.query('SELECT * FROM departments');
      if (!result.rows.length) {
        const error = {
          status: 'error',
          message: 'No department has been created yet!',
        };
        return httpResponseHandler.error(res, 404, error);
      }
      const response = {
        status: 'success',
        data: {
          message: 'Fetched department successfully',
          departments: [...result.rows],
        },
      };
      return httpResponseHandler.success(res, 200, response);
    } catch (error) {
      next(error);
    }
  };

  const fetchMembers = async (req, res, next) => {
    try {
      const result = await client.query('SELECT firstname, lastname FROM users JOIN departments ON users.department_id = departments.department_id WHERE users.department_id=$1', [req.user.departmentId]);
      if (!result.rows.length) {
        const response = {
          status: 'success',
          data: null,
          message: 'No members in your department!',
        };
        return httpResponseHandler.success(res, 200, response);
      }
      const response = {
        status: 'success',
        data: {
          message: 'Fetched department members successfully',
          members: result.rows,
        },
      };

      return httpResponseHandler.success(res, 200, response);
    } catch (error) {
      next(error);
    }
  };

  return {
    fetchDepartments,
    fetchMembers,
  };
}

module.exports = departmentController();
