const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const userRoutes = require('./routes/user');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRoutes);

app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.status = 404;
  err.message = `This route '${req.url}' does not exist on the server`;
  return next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  return res.json({
    status: 'error',
    error: err.message,
  });
});

const { PORT } = process.env;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
