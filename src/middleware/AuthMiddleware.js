import Joi from '@hapi/joi';
import bcrypt from 'bcrypt';
import Model from '../models/model';
import assignToken from './Validations';

const userModel = new Model('users');
const driverModel = new Model('drivers');

/**
 * @description - It validate all user input, if valid it call the next
 * middleware else return json object
 *
 * @param {object} req -request
 *
 * @param {object} res - response
 *
 * @param {function} next - the next middleware in the route
 *
 * @returns {object} - it return json object if inputs not valid
 */
export const validateCreateUser = async (req, res, next) => {
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().max(11).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
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
 * @description - this method checks for phone and email in the database.
 * it return json object if exist otherwise it call the next middleware
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {function} next - the next middleware
 *
 * @returns {object} - it return json object
 */
export const checkUserDetails = async (req, res, next) => {
  const { email, phone } = req.body;
  try {
    const emailExists = await userModel.select('*', `WHERE "email" = '${email}'`);
    const phoneNumberExists = await userModel.select('*', `WHERE "phone" = '${phone}'`);
    if (emailExists.rowCount) {
      return res.status(409).send({
        message: 'Email already exist',
        success: false
      });
    }

    if (phoneNumberExists.rowCount) {
      return res.status(409).send({
        message: 'Phone number already exist',
        success: false
      });
    }
    return next();
  } catch (err) {
    res.send({ message: `${err.message}` });
  }
};

/**
 *
 * @description - this method checks email in the database.
 * if invalid it return json object otherwise, it compare
 * the password with the hashed password in the database
 * if match it assign the user object a token and logged-in the user.
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
      return res.status(404).send({ message: 'Email or Password not found', success: false });
    }
    const passwordIsValid = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordIsValid) {
      res.status(404).send({ message: 'Email or Password not found', success: false });
    }
    const { id, firstName, lastName } = user.rows[0];
    const userData = {
      id,
      firstName,
      lastName,
      email
    };
    const token = assignToken(userData);
    return res.status(200).json({
      message: `Welcome back ${firstName} ${lastName}`,
      userData,
      token
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

/**
 * @description - this method checks for phone and email in the database.
 * it return json object if exist otherwise it call the next middleware
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {function} next - the next middleware
 *
 * @returns {object} - it json object
 */
export const checkDriverDetails = async (req, res, next) => {
  const { email, phone } = req.body;
  try {
    const emailExists = await driverModel.select('*', `WHERE "email" = '${email}'`);
    const phoneNumberExists = await driverModel.select('*', `WHERE "phone" = '${phone}'`);
    if (emailExists.rowCount) {
      return res.status(409).send({
        message: 'Email already exists',
        success: false
      });
    }

    if (phoneNumberExists.rowCount) {
      return res.status(409).send({
        message: 'Phone number already exists',
        success: false
      });
    }
    return next();
  } catch (err) {
    res.send({ message: `${err.message}` });
  }
};

/**
 * @description - this method checks email in the database.
 * if invalid it return json object otherwise, it compare
 * the password with the hashed password in the database
 * if match it assign the driver object a token and logged-in the driver.
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
      return res.status(404).send({ message: 'Password or Email not found', success: false });
    }
    const passwordIsValid = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordIsValid) {
      res.status(404).send({ message: 'Password or Email not found', success: false });
    }
    const { id, firstName, lastName } = user.rows[0];
    const driver = {
      id,
      firstName,
      lastName,
      email
    };
    const token = assignToken(driver);
    return res.status(200).json({
      message: `Welcome back ${firstName} ${lastName}`,
      driver,
      token
    });
  } catch (err) {
    res.send(err.message);
  }
};
