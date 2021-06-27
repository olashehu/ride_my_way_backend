import Model from '../models/model';

/**
 *@import - my model class and create a new instance of that model.
 this represent ride_history table in my database
 */
const RideHistoryModel = new Model('ride_history');

/**
 *@return {obj} - it return a promise of object from selected column in

 ride_history table when driver is a valid login driver

 * @param {object} req - request

 * @param {object} res - response
 */
export const DriverRideHistoryPage = async (req, res) => {
  const { id } = req.user.driver;
  try {
    const data = await RideHistoryModel.select('*', `WHERE "driver_id" = '${id}'`);
    res.status(200).json({ message: data.rows });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};

/**
 * @return {obj} - it return a promise of object data if user is a vilid login user
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 */
export const UserRideHistoryPage = async (req, res) => {
  const { id } = req.user.userData;
  try {
    const data = await RideHistoryModel.select('*', `WHERE "user_id" = '${id}'`);
    res.status(200).json({ message: data.rows });
  } catch (err) {
    res.status(400).json({ message: err.stack });
  }
};

/**
 * @return {obj} - this method return a promise of object containing history data.
 *
 * @param {object} req -request
 *
 * @param {object} res - response
 */
export const addHistory = async (req, res) => {
  const {
    driverId, offerId, userId, destination, price, status
  } = req.body;
  const columns = 'driver_id, offer_id, user_id, destination, price, status';
  const values = `
  '${driverId}', '${offerId}', '${userId}', '${destination}', '${price}', '${status}'`;
  try {
    const data = await RideHistoryModel.insertWithReturn(columns, values);
    res.status(200).json({ msg: data.rows });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};
