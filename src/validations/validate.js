import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;
const assignToken = (data) => {
  const tokes = jwt.sign({
    data
  }, secretKey, {
    expiresIn: '24h'
  });
  return tokes;
};

/**
 * @description - function checking if user token is valid or expire.
 *
 * @param {object} req - request bject
 *
 * @param {object} res - response object
 *
 * @param {object} next - it call the next function in the route proccess chain
 *
 * @return {object} - it return object of user with a sign token when user login
 */
export const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization;
  let tokenValue;
  try {
    if (token) {
      [, tokenValue] = token.split(' ');
      const userData = jwt.verify(tokenValue, secretKey);
      req.user = userData;
      console.log(req.user)
      if (userData) {
        next();
      } else {
        res.status(401).send({
          status: false,
          message: 'Authentication token is invalid or expired'
        });
      }
    } else {
      res.status(401).send({
        status: false,
        message: 'Authentication token does not exist'
      });
    }
  } catch (error) {
    res.status(401).send({
      status: false,
      message: 'Authentication token is invalid or expired'
    });
  }
};

export default assignToken;
