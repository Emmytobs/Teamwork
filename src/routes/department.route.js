const { Router } = require('express');
const departmentController = require('../controllers/department.controller');
const middleware = require('../middleware/auth');

const departmentRouter = Router();

departmentRouter.get('/departments', departmentController.fetchDepartments);

departmentRouter.use('/departments/members', middleware.authenticateUser);
departmentRouter.get('/departments/members', departmentController.fetchMembers);

module.exports = departmentRouter;
