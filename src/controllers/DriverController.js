import Model from '../models/model';
import assignToken from '../middleware/Validations';

const driverModel = new Model('drivers');

/**
 * @description - This method add driver to the database
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {object} - it return object with a token
 */
export const addDriver = async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    password
  } = req.body;
  const columns = `
  "firstName",
  "lastName", 
  phone,
  email,
  password
  `;

  const values = `
  '${firstName}',
  '${lastName}',
  '${phone}',
  '${email}',
  '${password}'
  `;
  try {
    const data = await driverModel.insertWithReturn(columns, values);
    const { id } = data.rows[0];
    const driver = {
      id,
      firstName,
      lastName,
      email: data.rows[0].email,
    };
    const token = assignToken(driver);
    res.status(201).json({
      driver,
      token,
      message: 'Account created successfully!',
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

/**
 * @description - This method update driver profile
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - it return json object
 */
export const editDriverProfile = async (req, res) => {
  const {
    data: { id },
  } = req.user;
  try {
    const data = await driverModel.update(req.body, `WHERE id = ${id}`);
    const {firstName, lastName, email} = data.rows[0];
    const updatedDriver = {id, firstName, lastName, email};
    if (data.rowCount === 0) {
      return res
        .status(404)
        .json({ data: [], Message: 'User not found', success: false });
    }
    return res
      .status(200)
      .json({
        message: 'Profile updated successfully',
        success: true,
        data: updatedDriver,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @description - This method fetch all driver in the database
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - it return object data of all driver
 */
export const getAllDriver = async (req, res) => {
  let total = 0;
  try {
    const data = await driverModel.select('id,"firstName", "lastName", email');
    total += data.rowCount;
    if (!data.rowCount) {
      return res
        .status(404)
        .json({ data: [], message: 'User not found', success: false });
    }
    return res.status(200).json({ data: data.rows, total, success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
