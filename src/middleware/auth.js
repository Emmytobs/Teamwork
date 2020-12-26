const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passwordGenerator = require('generate-password');
// const httpResponseHandler = require('../response_handler');

function middleware() {
  const generateToken = ({ user_id, firstname, lastname }) => { // eslint-disable-line camelcase
    const token = jwt.sign({ user_id, firstname, lastname }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    return token;
  };
  const authenticateUser = (req, res, next) => { // eslint-disable-line no-unused-vars
    const { token } = req;
    const isValid = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(isValid);
    // if (!isValid) {
    //   const error = {
    //     status: 'Error',
    //     message: 'Please sign in to be authenticated',
    //   };
    //   return httpResponseHandler.error(res, 403, error);
    // }

    // We need to attach the user_id and firstname to the request object;
    // req.user = isValid.
    // res.json(isValid)
  };
  const hashPassword = async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    req.hashedPassword = hashedPassword;
    next();
  };

  const generateRandomPassword = () => {
    const randomPassword = passwordGenerator.generate({
      length: 10,
      numbers: true,
      symbols: true,
    });
    return randomPassword;
  };

  return {
    generateToken,
    authenticateUser,
    hashPassword,
    generateRandomPassword,
  };
}

module.exports = middleware();
