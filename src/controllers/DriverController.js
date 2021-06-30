// import jwt from 'jsonwebtoken';
import Model from '../models/model';
import assignToken from '../validations/validate';

// const secretKey = process.env.SECRET_KEY;

const driverModel = new Model('drivers');

/**
 * @description - This method will handle the request for adding rigister driver
 * to the database,and return back driver object which is a result of a promise
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {object} - it return object with a token
 */
export const addDriver = async (req, res) => {
  const {
    firstName, lastName, address, phone, email, password
  } = req.body;
  const columns = '"firstName", "lastName", address, phone, email, password';
  // eslint-disable-next-line max-len
  const values = `'${firstName}', '${lastName}', '${address}', '${phone}', '${email}', '${password}'`;
  try {
    const data = await driverModel.insertWithReturn(columns, values);
    const { id } = data.rows[0];
    const driver = {
      id,
      email: data.rows[0].email
    };
    const token = assignToken(driver);
    res.status(200).json({
      driver,
      token,
      message: 'Account created successfully!'
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * @description - This method hadle the request for updating driver profile
 * it return an object with "success message" or "access denied" if user is not valid
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - it return object with a message if user is valid or invalid
 */
export const editDriverProfile = async (req, res) => {
  const { id } = req.user.driver;
  try {
    const data = await driverModel.update(req.body, `WHERE id = '${id}'`);
    if (data.rows[0].id !== id) {
      return res.status(400).json({ Message: 'Access denied, Please, Login or Register' });
    }
    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * @description - This method handle the request for getting all register driver
 * and return an object of all driver
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - it return object of all driver
 */
export const getAllDriver = async (req, res) => {
  try {
    const data = await driverModel.select('*');
    if (!data.rowCount) {
      return res.status(400).json({ message: 'Bad request' });
    }
    return res.status(200).json({ message: data.rows });
  } catch (error) {
    return res.status(400).json({ message: error.stack });
  }
};
