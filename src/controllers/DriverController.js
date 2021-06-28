// import jwt from 'jsonwebtoken';
import Model from '../models/model';
import assignToken from '../validations/validate';

// const secretKey = process.env.SECRET_KEY;

const driverModel = new Model('drivers');

/**
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {obj} -
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
 *
 * @param {obj} req - request
 *
 * @param {obj} res - response
 *
 * @returns {obj} - it return bad request if invalid otherwise return success message
 */
export const editDriverProfile = async (req, res) => {
  const { firstName } = req.body;
  const { id } = req.user.driver;
  try {
    const data = await driverModel.update(`first_name = '${firstName}' WHERE "id" = '${id}'`);
    if (!data.rowCount) {
      return res.status(400).json({ Message: 'Bad request' });
    }
    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {obj} - it return all login drivers as a promise
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
