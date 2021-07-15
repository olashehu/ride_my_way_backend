import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import bcrypt from 'bcrypt';
import Model from '../models/model';

const secretKey = process.env.SECRET_KEY;

const offerModel = new Model('ride_offer');

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
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {next} next - next middleware in the proccess circle
 *
 * @returns {object} - response object
 */
export const validateProfile = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3)
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();
};
/**
 * @description - This method validate driver input. if valid, it call the next middleware
 * otherwise return error object
 *
 * @param {object} req - req
 *
 * @param {object} res - res
 *
 * @param {function} next - it call the next function in the route proccess chain
 *
 * @returns {object} - if error, return error object
 */
export const validateCreateDriver = async (req, res, next) => {
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().max(11).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required(),
    carModel: Joi.string().required(),
    modelYear: Joi.number().min(2005).max(2021).required(),
    licencePlate: Joi.string().required()
  });
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { password } = req.body;
  req.body.password = await bcrypt.hash(password, 10);
  return next();
};

/**
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {function} next - it call the next middleware
 *
 * @returns {object} - object
 */
export const validateDestinationExist = async (req, res, next) => {
  const { destination } = req.body;
  const schema = Joi.object({
    destination: Joi.string().required(),
    price: Joi.number().integer().required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const destinationExist = await offerModel
      .select('*', ` WHERE destination = '${destination}'`);
    if (destinationExist.rowCount) {
      return res.status(409).json({
        message: 'destination already exist, please enter a new destination!',
        status: false
      });
    }
    return next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default assignToken;
