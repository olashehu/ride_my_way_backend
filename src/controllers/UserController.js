import Model from '../models/model';
import assignToken from '../middleware/Validations';
import sendMail from '../email/NodeMailer';
import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

const userModel = new Model('users');
const rideHistoryModel = new Model('ride_history');
const offerModel = new Model('ride_offer');

const htmlTemplate = fs.readFileSync(
    path.join(__dirname, `index.html`),
    'utf-8',
  );

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
    firstName, lastName, phone, email, password
  } = req.body;
  const columns = '"firstName", "lastName", phone, email, password';
  const values = `
  '${firstName}',
  '${lastName}',
  '${phone}',
  '${email}',
  '${password}'`;
  try {
    const data = await userModel.insertWithReturn(columns, values);
    const { id } = data.rows[0];
    const user = {
      id, firstName, lastName, email: data.rows[0].email
    };
    const token = assignToken(user);
    res.status(201).json({
      user,
      token,
      message: 'Account created successfully!'
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
 * @returns {object} - return json object
 */
export const editUserProfile = async (req, res) => {
  const { data: { id } } = req.user;
  try {
    const data = await userModel.update(req.body, `WHERE "id" = '${id}'`);
    const { firstName, lastName, } = data.rows[0];
    const userData = {
      id,
      firstName,
      lastName
    }
    if (data.rowCount === 0) {
      return res.status(404).json({ data: [], message: 'User not found', success: false });
    }
    return res.status(200).json(
      { data: userData, message: 'Profile updated successfully', success: true }
    );
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

/**
 * @description - This method fetch and return all users
 * in the database and return data object
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
      return res.status(404).json({ data: [], message: 'User not found', success: false });
    }
    return res.status(200).json({ data: data.rows, total, success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

/**
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - json object
 */
export const requestForRide = async (req, res) => {
  const userId = req.user.data.id;
  const offerId = req.params.id;
  const { data: { firstName } } = req.user;
  const driverEmail = req.body.driverEmail;
  const driverFirstName = req.body.driverFirstName;
  const subject = 'Ride request'
  const emailTemplate = Mustache.render(htmlTemplate, { name: `${driverFirstName}`, user: `${firstName}` });
  
  try {
    const offer = await offerModel.select('id, "driverId", location, destination, price', ` WHERE "id" = '${offerId}'`);
    if (offer.rowCount === 0) {
      return res.status(404).json({ data: [], message: 'Offer not found', success: false });
    }

    const {
      id, driverId, location, destination, price
    } = offer.rows[0];
    const columns = '"offerId", "driverId", "userId", location, destination, price, status';
    const values = `
    '${id}', '${driverId}', '${userId}', '${location}','${destination}', '${price}', 'Pending' `;
    await rideHistoryModel.insertWithReturn(columns, values);
    sendMail(driverEmail, emailTemplate, subject, (err, data)=>{
      if(err){
        return res.status(500).json({
        error: err.message,
        success: false
    });
      }else{
      return  res.status(201).json({
      data: offer.rows[0],
      message: `Thank you for choosing RMW at ${firstName}`,
      success: true
    });
      }
    });
    
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      success: false
    });
  }
};
