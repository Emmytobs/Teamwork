const { Router } = require('express');

const postRouter = Router();
const postController = require('../controllers/post.controller');
const middleware = require('../middleware/auth');

postRouter.use('/post', middleware.authenticateUser);
postRouter.post('/post', postController.createPost);

postRouter.use('/posts/read', middleware.authenticateUser);
postRouter.get('/posts/read', postController.fetchPosts);

postRouter.use('/post', middleware.authenticateUser);
postRouter.put('/post', postController.updatePost);

postRouter.use('/post', middleware.authenticateUser);
postRouter.delete('/post', postController.deletePost);

module.exports = postRouter;
