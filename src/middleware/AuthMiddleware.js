import Joi from 'joi';
import bcrypt from 'bcrypt';
import Model from '../models/model';
import assignToken from '../validations/validate';

const userModel = new Model('users');
const driverModel = new Model('drivers');

/**
 * @param {object} req -request
 *
 * @param {object} res - response
 *
 * @param {obj} next - the next middleware in the stack
 *
 * @returns {obj} - it return a valid data if all the requirement is pass
 * otherwise reject it
 */
export const validateCreateUser = async (req, res, next) => {
  const userSchema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().max(50).required(),
    phone: Joi.string().max(11).required(),
    email: Joi.string().max(50).required(),
    password: Joi.string().min(7).required()
  };

  const { error } = Joi.validate(req.body, userSchema);
  if (error) {
    return res.status(400).send(error.details);
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
 * @param {obj} next - it call the next middleware in the stack
 *
 * @returns {obj} -
 */
export const checkUserDetails = async (req, res, next) => {
  const { email, phone } = req.body;
  try {
    const emailExists = await userModel.select('*', `WHERE "email" = '${email}'`);
    const phoneNumberExists = await userModel.select('*', `WHERE "phone" = '${phone}'`);
    if (emailExists.rowCount) {
      return res.status(400).send({
        message: 'Email already exists',
        status: false
      });
    }

    if (phoneNumberExists.rowCount) {
      return res.status(400).send({
        message: 'Phone number already exists',
        status: false
      });
    }
    return next();
  } catch (error) {
    res.send({ erroe: `${error.message}` });
  }
};

/**
 *
 * @param {obj} req - request
 *
 * @param {obj} res - response
 *
 * @returns {obj} - return user object  id, firstName and a token
 */
export const loginUser = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await userModel.select('*', `WHERE "email" = '${email}'`);
    if (!user.rowCount) {
      return res.status(400).send({ message: 'Email does not exist' });
    }
    const passwordIsValid = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordIsValid) {
      res.status(400).send({ message: 'Password does correct' });
    }
    const { id, firstName } = user.rows[0];
    const userData = {
      id,
      firstName
    };
    const token = assignToken(userData);
    return res.status(200).json({
      Message: 'Welcome',
      userData,
      token
    });
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * @description - it validate phone and email if they already exist in the database
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @param {object} next - it call the next middleware in the route process chain
 *
 * @returns {object} - it pass the driver information to the next middleware if valid
 */
export const checkDriverDetails = async (req, res, next) => {
  const { email, phone } = req.body;
  try {
    const emailExists = await driverModel.select('*', `WHERE "email" = '${email}'`);
    const phoneNumberExists = await driverModel.select('*', `WHERE "phone" = '${phone}'`);
    if (emailExists.rowCount) {
      return res.status(400).send({
        message: 'Email already exists',
        status: false
      });
    }

    if (phoneNumberExists.rowCount) {
      return res.status(400).send({
        message: 'Phone number already exists',
        status: false
      });
    }
    return next();
  } catch (error) {
    res.send({ error: `${error.message}` });
  }
};

/**
 * @description - Driver login endpoint
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {object} - it return driver object containning data
 * id, firstName and a token
 */
export const DriverLogin = async (req, res) => {
  const { password, email, } = req.body;
  try {
    const user = await driverModel.select('*', `WHERE "email" = '${email}'`);
    if (!user.rowCount) {
      return res.status(400).send({ message: 'Email does not exist' });
    }
    const passwordIsValid = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordIsValid) {
      res.status(400).send({ message: 'Password does correct' });
    }
    const { id, firstName } = user.rows[0];
    const driver = {
      id,
      firstName,
      email
    };
    const token = assignToken(driver);
    return res.status(200).json({
      driver,
      token
    });
  } catch (error) {
    res.send(error.message);
  }
};
