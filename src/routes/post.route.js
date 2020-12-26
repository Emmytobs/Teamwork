const { Router } = require('express');
const postRouter = Router()
const postController = require('../controllers/post.controller')
const middleware = require('../middleware/auth')

postRouter.use('/post', middleware.authenticateUser);
postRouter.post('/post', postController.createPost);

module.exports = postRouter;
