import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import bcrypt from 'bcrypt';
import Model from '../models/model';

const secretKey = process.env.SECRET_KEY;

const offerModel = new Model('ride_offer');
const rideHistoryModel = new Model('ride_history');

/**
 * @description - This method assign a token to user object
 *
 * @param {object} data - user/driver object
 *
 * @return {object} - it return token with data object containing
 * user/driver information.
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
 * @description - This method verify the token and the token
 * get assign to a user property of req object. if valid it
 * call the next middleware otherwise, it return json object.
 *
 * @param {object} req - request bject
 *
 * @param {object} res - response object
 *
 * @param {function} next - the next middleware
 *
 * @return {object} - object
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
 * @description - This method validate user request to edit information
 * It return json object if invalid otherwise, it call the next middleware
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {function} next - the next middleware
 *
 * @returns {object} - object
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
 * @description - This method validate driver inputs, if inputs not valid, it return
 * json object, otherwise, it hash the password and call the next middleware
 *
 * @param {object} req - req
 *
 * @param {object} res - res
 *
 * @param {function} next - the next middleware
 *
 * @returns {object} - object
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
    return res.status(400).json({ message: error.details[0].message, success: false });
  }
  const { password } = req.body;
  req.body.password = await bcrypt.hash(password, 10);
  return next();
};

/**
 * @description - this method checks for destination in offer table.
 * if exist, it return json object, else it call the next middleware.
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {function} next - the next middleware
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
        message: 'Destination already exist, please enter a new destination!',
        status: false
      });
    }
    return next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @description - this method check for driverId in offer table and
 * compare it with the id of the token. if it matches it call the next
 * middleware, otherwise, it return json object.
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {function} next - next middleware
 *
 * @returns {object} - json object
 */
export const validateId = async (req, res, next) => {
  const { data: { id } } = req.user;
  try {
    const isValidId = await offerModel.select('*', `WHERE "driverId" = '${id}'`);
    if (isValidId.rowCount === 0) {
      return res.status(401).json({ message: 'Unauthorize to delete this offer', success: false });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {object} req - requesr
 *
 * @param {object} res - response
 *
 * @param {function} next - the next middleware
 *
 *@return {object} - json object
 */
export const offerExist = async (req, res, next) => {
  const { id } = req.params;
  try {
    const dataExistInHistory = await rideHistoryModel.select('*', ` WHERE "offerId" = ${id}`);
    if (dataExistInHistory.rowCount > 0) {
      return res.status(409).json({
        message: " You can't join same ride you are currently on",
        success: false
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/**
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {function} next - next middleware
 *
 * @returns {object} error - error object from joi
 */
export const ModifyOffer = async (req, res, next) => {
  const offerSchema = Joi.object({
    destination: Joi.string().min(5),
    price: Joi.number().min(3)
  });
  const { error } = offerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message, success: false });
  return next();
};
export default assignToken;
