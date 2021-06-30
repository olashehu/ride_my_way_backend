import jwt from 'jsonwebtoken';
import Joi from 'joi';

const secretKey = process.env.SECRET_KEY;

/**
 * @param {obj} data - driver object
 *
 * @return {obj} - token with driver object data
 */
const assignToken = (data) => {
  const tokes = jwt.sign({
    data
  }, secretKey, {
    expiresIn: '24h'
  });
  return tokes;
};

/**
 * @description - This method validate user token
 *
 * @param {object} req - request bject
 *
 * @param {object} res - response object
 *
 * @param {object} next - it call the next function in the route proccess chain
 *
 * @return {object} - it return object of user with a sign token
 */
export const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization;
  let tokenValue;
  try {
    if (token) {
      [, tokenValue] = token.split(' ');
      const userData = jwt.verify(tokenValue, secretKey);
      req.user = userData;
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
/**
 * @description - This method validate user request to edit is first and last name
 * It return error if user input is less than three character
 *
 * @param {obj} req - request
 *
 * @param {obj} res - response
 *
 * @param {next} next - next middleware in the proccess circle
 *
 * @returns {object} - user object
 */
export const validateProfile = async (req, res, next) => {
  const userSchema = {
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
  };

  const { error } = Joi.validate(req.body, userSchema);
  if (error) {
    return res.status(400).send(error.details);
  }
  return next();
};

export default assignToken;
