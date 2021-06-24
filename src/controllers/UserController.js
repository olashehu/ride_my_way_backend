import jwt from 'jsonwebtoken';
import Model from '../models/model';

const userModel = new Model('users');
const secretKey = process.env.SECRET_KEY;

/**
 * @param {object} req - request object
 * @param {object} res- response object
 * @return it returns a promise of user object and assign it a token
 */
export const addUsers = async (req, res) => {
  const {
    firstName, lastName, address, phone, email, password
  } = req.body;
  const columns = 'first_name, last_name, address, phone, email, password';
  // eslint-disable-next-line max-len
  const values = `'${firstName}', '${lastName}', '${address}', '${phone}', '${email}', '${password}'`;
  try {
    const data = await userModel.insertWithReturn(columns, values);
    const { id } = data.rows[0];
    const token = jwt.sign({
      id,
      email
    }, secretKey, {
      expiresIn: '24h'
    });
    res.status(200).json({
      id,
      email,
      token,
      message: 'User created successfully!'
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 *
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns it return a success message if the request is a login user
 */
export const editUserProfile = async (req, res) => {
  const { firstName } = req.body;
  const { id } = req.user.userData;
  try {
    const data = await userModel.update(`first_name = '${firstName}' WHERE "id" = ${id}`);
    if (!data.rowCount) {
      return res.status(400).json({ Message: 'Bad request' });
    }
    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.json({ message: error.message });
  }
};

/**
 *
 * @param {object} req - request
 * @param {object} res - response
 * @returns all user data in the database
 */
export const getAllUser = async (req, res) => {
  try {
    const data = await userModel.select('*');
    if (!data.rowCount) {
      return res.status(400).json({ message: 'Bad request' });
    }
    return res.status(200).json({ message: data.rows });
  } catch (error) {
    return res.status(400).json({ message: error.stack });
  }
};
