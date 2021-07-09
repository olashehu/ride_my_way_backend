import jwt from 'jsonwebtoken';
import Joi from 'joi';
import bcrypt from 'bcrypt';

const secretKey = process.env.SECRET_KEY;

/**
 * @description - This method assign a token to user object t
 *
 * @param { object } data - driver object
 *
 * @return { object } - token with driver object data
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
 * @param { object } req - request bject
 *
 * @param { object } res - response object
 *
 * @param { object } next - it call the next function in the route proccess chain
 *
 * @return { object } - response object
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
 * @description - This method validate user request to edit first and last name
 * It return error if user input is less than three character
 *
 * @param { object } req - request
 *
 * @param { object } res - response
 *
 * @param { next } next - it call next middleware in the proccess circle
 *
 * @returns { object } - response object
 */
export const validateProfile = async (req, res, next) => {
  const userSchema = {
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
  };

  const { error } = Joi.validate(req.body, userSchema);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  return next();
};
/**
 * @description - This method validate driver input. if valid it pass the request body of the
 * user to next function in the route proccess chain.
 *
 * @param { object } req - req
 *
 * @param { object } res - res
 *
 * @param { function } next - it call the next function in the route proccess chain
 *
 * @returns { object } - if error, return error object
 */
export const validateCreateDriver = async (req, res, next) => {
  const userSchema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().max(100).required(),
    phone: Joi.string().max(11).required(),
    email: Joi.string().email().max(256).required(),
    password: Joi.string().min(7).required(),
    carModel: Joi.string().max(20).required(),
    modelYear: Joi.number().min(2005).max(2021).required(),
    licencePlate: Joi.string().required()
  };

  const { error } = Joi.validate(req.body, userSchema);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { password } = req.body;
  req.body.password = await bcrypt.hash(password, 10);
  return next();
};

export default assignToken;
