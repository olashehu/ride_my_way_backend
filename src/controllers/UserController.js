// import jwt from 'jsonwebtoken';
import Model from '../models/model';
import assignToken from '../validations/validate';

const userModel = new Model('users');
// const secretKey = process.env.SECRET_KEY;

/**
 * @description - This method handle the request coming to url and
 * add new user to the database. It return user object with a token.
 *
 * @param { object } req - request object
 *
 * @param { object } res - response object
 *
 * @return { object } - it return user object which is a result of a promise
 */
export const addUsers = async (req, res) => {
  const {
    firstName, lastName, address, phone, email, password
  } = req.body;
  const columns = '"firstName", "lastName", address, phone, email, password';
  // eslint-disable-next-line max-len
  const values = `'${firstName}', '${lastName}', '${address}', '${phone}', '${email}', '${password}'`;
  try {
    const data = await userModel.insertWithReturn(columns, values);
    const { id } = data.rows[0];
    const user = { id, email: data.rows[0].email };
    const token = assignToken(user);
    res.status(200).json({
      user,
      token,
      message: 'User created successfully!'
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

/**
 * @description - This method will update the database and a success
 * true or false.
 *
 * @param { object } req - request object
 *
 * @param { object } res - response object
 *
 * @returns { object } - if a valid user message "success true" otherwise
 * "success false."
 */
export const editUserProfile = async (req, res) => {
  const { id } = req.user.data;
  try {
    const data = await userModel.update(req.body, `WHERE "id" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json({ data: [], message: 'user does not exist' });
    }
    return res.status(200).json(
      { message: 'Profile updated successfully', success: true }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @description - This method handle the request coming to the url to
 * get all users and return object of all login users.
 *
 * @param { object } req - request
 *
 * @param { object } res - response
 *
 * @returns { object } - object of all users from the database
 */
export const getAllUser = async (req, res) => {
  try {
    const data = await userModel.select('*');
    const {
      id, firstName, lastName, email
    } = data.rows[0];
    const users = {
      id, firstName, lastName, email
    };
    if (!data.rowCount) {
      return res.status(404).json({ data: [], message: 'data not exist', success: false });
    }
    return res.status(200).json({ data: users, success: true });
  } catch (err) {
    return res.status(500).json({ message: 'internal server error', success: false });
  }
};
