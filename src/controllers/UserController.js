import Model from '../models/model';
import assignToken from '../validations/validate';

const userModel = new Model('users');
const rideHistoryModel = new Model('ride_history');
const offerModel = new Model('ride_offer');

/**
 * @description - This method add user to database and return object data
 *
 * @param {object} req - request object
 *
 * @param {object} res - response object
 *
 * @return {object} - it return user object
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
    res.status(201).json({
      user,
      token,
      message: 'User created successfully!'
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

/**
 * @description - This method update user profile
 *
 * @param {object} req - request object
 *
 * @param {object} res - response object
 *
 * @returns {object} - return message object
 */
export const editUserProfile = async (req, res) => {
  const { data: { id } } = req.user;
  try {
    const data = await userModel.update(req.body, `WHERE "id" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json({ data: [], message: 'user does not exist' });
    }
    return res.status(201).json(
      { message: 'Profile updated successfully', success: true }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @description - This method fetch all user in database and return data object
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - object of all users from the database
 */
export const getAllUser = async (req, res) => {
  let total = 0;
  try {
    const data = await userModel.select('id, "firstName", "lastName", email');
    total += data.rowCount;
    if (!data.rowCount) {
      return res.status(404).json({ data: [], message: 'data not exist', success: false });
    }
    return res.status(201).json({ data: data.rows, total, success: true });
  } catch (err) {
    return res.status(500).json({ message: 'internal server error', success: false });
  }
};

/**
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} -
 */
export const requestForRide = async (req, res) => {
  const userId = req.user.data.id;
  const offerId = req.params.id;
  try {
    const offer = await offerModel
      .select('id, "driverId", destination, price', ` WHERE "id" = '${offerId}'`);
    if (!offer.rowCount) {
      return res.status(404).json({ data: [], message: 'this id has no offer', success: false });
    }
    const {
      id, driverId, destination, price
    } = offer.rows[0];
    const columns = '"offerId", "driverId", "userId", destination, price, status';
    const values = `
    '${id}', '${driverId}', '${userId}', '${destination}', '${price}', 'pending'`;
    await rideHistoryModel.insertWithReturn(columns, values);
    res.status(201).json({ message: 'offer created successfully', success: true });
  } catch (err) {
    return res.status(500).json({
      error: err.stack,
      success: false
    });
  }
};
