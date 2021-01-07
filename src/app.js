const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
const departmentRoutes = require('./routes/department.route');
// const commentRoutes = require('./routes/comment.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRoutes);
app.use(postRoutes);
app.use(departmentRoutes);
// app.use(commentRoutes);

app.get('/test', (req, res) => {
  res.send('Server returned a response!');
});

app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.status = 404;
  err.message = `This route '${req.url}' does not exist on the server`;
  return next(err);
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status || 500);
  return res.json({
    status: 'error',
    message: err.message,
  });
});

const { PORT } = process.env;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`)); // eslint-disable-line no-console
