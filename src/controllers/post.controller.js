const client = require('../../config/db');

const httpResponseHandler = require('../response_handler');

function postController() {
  const createPost = async (req, res, next) => { // eslint-disable-line consistent-return
    try {
      if (req.body.gif) {
        // Upload image to cloudinary and retrieve the link
      }
      const { userId, departmentId } = req.user;
      const result = await client.query(
        'INSERT INTO posts (article, gif_link, created_by, created_at in_department) RETURNING *',
        [req.body.article, req.body.gif, userId, 'NOW()', departmentId],
      );

      const {
        article, gif_link, created_by, created_at, // eslint-disable-line camelcase
      } = result.rows[0];

      const response = {
        status: 'success',
        data: {
          message: 'Post was created successfully',
          post: {
            article,
            gif_link,
            created_by,
            created_at,
          },
        },
      };
      return httpResponseHandler.success(res, 201, response);
    } catch (error) {
      next(error);
    }
  };

  const fetchPosts = async (req, res, next) => {
    try {
      const result = await client.query(
        `
        SELECT users.firstname, users.lastname, users.profile_pic, posts.created_at, posts.article, posts.gif_link 
        FROM posts 
        JOIN users ON posts.created_by = users.user_id 
        WHERE users.department_id = $1 
        ORDER BY posts.created_at LIMIT 10 OFFSET 0
        `,
        [req.user.departmentId]
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
      return httpResponseHandler.success(res, 200, response)
    } catch (error) {
      next(error)
    }
  }

  return {
    createPost,
    fetchPosts
  };
}

module.exports = postController();
