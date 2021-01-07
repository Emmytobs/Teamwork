/* eslint-disable consistent-return */

const client = require('../../config/db');
const httpResponseHandler = require('../response_handler');

function commentController() {
  const fetchComments = async (req, res, next) => {
    const { userId, departmentId } = req.user;
    try {
        const result = await client.query(
            `
            SELECT users.firstname, users.lastname, comments.content, comments.created_at
            FROM comments
            JOIN users ON comments.created_by = users.user_id
            WHERE comments.in_department = $1 AND comments.post_id = $2
            `,
          [departmentId, req.body.postId],
        );
    
        if (!result.rows.length) {
            const response = {
                status: 'success',
                data: null,
                message: 'No comments found',
            };
            return httpResponseHandler.success(res, 200, response);
        }
    
        const response = {
            status: 'success',
            data: {
                message: 'Comments fetched successfully',
                comments: [ ...result.rows ]
            }
        };
        return httpResponseHandler.success(res, 200, response);
    } catch (error) {
        next(error);
    }
  };

  const createComments = async (req, res, next) => {
    const { userId, departmentId } = req.user;
    try {
        const result = await client.query(
            `
            INSERT INTO comments (centent, created_at, in_department, created_by, post_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
            `,
            [req.body.content, 'NOW()', departmentId, userId, req.body.postId]
        );

        const response = {
            status: 'success',
            data: {
                message: 'Comment created successfully',
                comment: result.rows[0],
            }
        };
        return httpResponseHandler.success(res, 201, response);

    } catch (error) {
        next(error);
    }
  };

  return {
    createComments,
    fetchComments,
  };
}

module.exports = commentController();
