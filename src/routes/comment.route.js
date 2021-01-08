const { Router } = require('express');

const commentController = require('../controllers/comment.controller');
const { authenticateUser } = require('../middleware/auth');

const commentRouter = Router();

commentRouter.use('/comments/read', authenticateUser);
commentRouter.post('/comments/read', commentController.fetchComments);

commentRouter.use('/comments', authenticateUser);
commentRouter.post('/comments', commentController.createComments);

module.exports = commentRouter;
