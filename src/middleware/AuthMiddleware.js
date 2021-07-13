import Joi from '@hapi/joi';
import bcrypt from 'bcrypt';
import Model from '../models/model';
import assignToken from '../validations/validate';

const userModel = new Model('users');
const driverModel = new Model('drivers');

/**
 * @description - It validate all user input, if valid it call the next
 * middleware else return error
 *
 * @param {object} req -request
 *
 * @param {object} res - response
 *
 * @param {object} next - the next middleware in the route
 *
 * @returns {object} - it return error object if inputs not valid
 */
export const validateCreateUser = async (req, res, next) => {
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().max(11).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required()
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
 * @description - this method checks for phone and email in the database. if exist
 * it return object message, otherwise it call the next middleware
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {object} next - it call the next middleware in the stack
 *
 * @returns {object} - it return object
 */
export const checkUserDetails = async (req, res, next) => {
  const { email, phone } = req.body;
  try {
    const emailExists = await userModel.select('*', `WHERE "email" = '${email}'`);
    const phoneNumberExists = await userModel.select('*', `WHERE "phone" = '${phone}'`);
    if (emailExists.rowCount) {
      return res.status(409).send({
        message: 'Email already exists',
        status: false
      });
    }

    if (phoneNumberExists.rowCount) {
      return res.status(409).send({
        message: 'Phone number already exists',
        status: false
      });
    }
    return next();
  } catch (err) {
    res.send({ message: `${err.message}` });
  }
};

/**
 *
 * @description - this method checks user loggin details and return
 * token and user objects
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - it return data object
 */
export const loginUser = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await userModel.select('*', `WHERE "email" = '${email}'`);
    if (!user.rowCount) {
      return res.status(404).send({ message: 'Email does not exist' });
    }
    const passwordIsValid = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordIsValid) {
      res.status(404).send({ message: 'Password does not exist' });
    }
    const { id, firstName } = user.rows[0];
    const userData = {
      id,
      firstName
    };
    const token = assignToken(userData);
    return res.status(200).json({
      message: 'logged in successfully',
      userData,
      token
    });
  } catch (err) {
    res.send(err.message);
  }
};

/**
 * @description - this checks for phone and email in the database. if exist
 * it return object message, otherwise it call the next middleware.
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {object} next - next middleware in the route process chain
 *
 * @returns {object} - it return object with message and status
 */
export const checkDriverDetails = async (req, res, next) => {
  const { email, phone } = req.body;
  try {
    const emailExists = await driverModel.select('*', `WHERE "email" = '${email}'`);
    const phoneNumberExists = await driverModel.select('*', `WHERE "phone" = '${phone}'`);
    if (emailExists.rowCount) {
      return res.status(409).send({
        message: 'Email already exists',
        status: false
      });
    }

    if (phoneNumberExists.rowCount) {
      return res.status(409).send({
        message: 'Phone number already exists',
        status: false
      });
    }
    return next();
  } catch (err) {
    res.send({ message: `${err.message}` });
  }
};

/**
 * @description - this method checks driver loggin details and return
 * token and driver objects
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {object} - return object driver and a token
 */
export const DriverLogin = async (req, res) => {
  const { password, email, } = req.body;
  try {
    const user = await driverModel.select('*', `WHERE "email" = '${email}'`);
    if (!user.rowCount) {
      return res.status(404).send({ message: 'Email does not exist' });
    }
    const passwordIsValid = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordIsValid) {
      res.status(404).send({ message: 'Password does correct' });
    }
    const { id, firstName } = user.rows[0];
    const driver = {
      id,
      firstName,
      email
    };
    const token = assignToken(driver);
    return res.status(200).json({
      message: 'logged in successfully',
      driver,
      token
    });
  } catch (err) {
    res.send(err.message);
  }
};
