/* eslint-disable consistent-return */

const client = require('../../config/db');

const httpResponseHandler = require('../response_handler');

function postController() {
  const createPost = async (req, res, next) => { // eslint-disable-line consistent-return
    try {
      if (req.body.gif) {
        // Upload image to cloudinary and retrieve the link
      }
      const { userId, departmentId } = req.user;
      const postResult = await client.query(
        `INSERT INTO posts (article, gif_link, created_by, created_at, in_department)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [req.body.article, req.body.gif, userId, 'NOW()', departmentId],
      );
      /* eslint-disable max-len */
      const result = await client.query(
        `
        SELECT users.firstname, users.lastname, users.profile_pic, posts.created_at, posts.article, posts.gif_link 
        FROM posts
        JOIN users
        ON posts.created_by = users.user_id
        WHERE posts.post_id = $1
        `,
        [postResult.rows[0].post_id],
      );

      const response = {
        status: 'success',
        data: {
          message: 'Post was created successfully',
          post: {
            ...result.rows[0],
          },
        },
      };
      return httpResponseHandler.success(res, 201, response);
    } catch (error) {
      next(error);
    }
  };

  const fetchPosts = async (req, res, next) => {
    const { limit = 10, offset = 0 } = req.query;
    try {
      const result = await client.query(
        `
        SELECT users.firstname, users.lastname, users.profile_pic, posts.post_id, posts.created_at, posts.article, posts.gif_link 
        FROM posts 
        JOIN users ON posts.created_by = users.user_id 
        WHERE users.department_id = $1 
        ORDER BY posts.created_at DESC LIMIT $2 OFFSET $3
        `,
        [req.user.departmentId, limit, offset],
      );

      if (!result.rows.length) {
        const response = {
          status: 'success',
          data: null,
          message: 'No post has been created',
        };
        return httpResponseHandler.success(res, 200, response);
      }

      const response = {
        status: 'success',
        data: {
          posts: result.rows,
          message: 'Posts fetched successfully',
        },
      };
      return httpResponseHandler.success(res, 200, response);
    } catch (error) {
      next(error);
    }
  };

  const updatePost = async (req, res, next) => {
    try {
      const { article, postId } = req.body;
      const result = await client.query(
        `
        UPDATE posts SET article = $1 
        WHERE created_by = 
        RETURNING *
        `,
        [article, postId, req.user.userId],
      );
      console.log(result.rows[0]);
      const response = {
        status: 'success',
        data: {
          message: 'Post updated successfully',
          post: result.rows[0],
        },
      };
      return httpResponseHandler.success(res, 200, response);
    } catch (error) {
      next(error);
    }
  };

  const deletePost = async (req, res, next) => {
    try {
      const { postId } = req.body;
      await client.query(
        `
        DELETE FROM posts
        WHERE post_id = $1
        `,
        [postId],
      );

      const response = {
        status: 'success',
        data: {
          message: 'Post deleted successfully',
        },
      };
      return httpResponseHandler.success(res, 200, response);
    } catch (error) {
      next(error);
    }
  };

  return {
    createPost,
    fetchPosts,
    updatePost,
    deletePost,
  };
}

module.exports = postController();
