const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passwordGenerator = require('generate-password');
// const httpResponseHandler = require('../response_handler');

function middleware() {
  const generateToken = ({ user_id, firstname, lastname }) => { // eslint-disable-line camelcase
    const token = jwt.sign({ user_id, firstname, lastname }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    return token;
  };

  const authenticateUser = async (req, res, next) => { // eslint-disable-line no-unused-vars
    try {
      const token = req.header('Authorization').split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // JS doesn't get to the following condition because the verify method 
      // on jwt also throws an error,
      // so JS skips to the catch block and doesn't ever get to the condition below
      if (!payload) {
        const err = new Error('This token is invalid');
        err.status = 401;
        throw err;
      }
      
      const user = { 
        userId: payload.user_id, 
        firstname: payload.firstname, 
        lastname: payload.lastname,
      }; 
      // We need to attach the user_id and firstname to the request object;
      req.user = user;
      next();
    } catch (error) {
      next(error)
    }
   
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

// sharesight
// wallmine
// atom