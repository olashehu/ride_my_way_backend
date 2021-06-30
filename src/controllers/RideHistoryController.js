import Model from '../models/model';

/**
 *@import - my model class and create a new instance of that model.
 this represent ride_history table in my database
 */
const RideHistoryModel = new Model('ride_history');

/**
 * @description - This method handle the request coming to url and
 * return object of data if the user id matches the database id
 *
 * @return {object} - it return object of user history which is a result
 * of a promise

 * @param {object} req - request

 * @param {object} res - response
 */
export const DriverRideHistoryPage = async (req, res) => {
  const { id } = req.user.driver;
  try {
    const data = await RideHistoryModel.select('*', `WHERE "driver_id" = '${id}'`);
    if (data.rows[0].driver_id !== id) {
      return res.status(401).json({ message: 'Access denied, please login!' });
    }
    return res.status(200).json({ message: data.rows });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};

/**
 * @description - This method will hadle the request for fetching all user ride history
 * and return back an object of data
 *
 * @return { object } - it return a promise of object data if user is a vilid login user
 *
 * @param { object } req - request
 *
 * @param { object } res - response
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
 * @description - This method will add to database history_table
 *
 * @return { object } - this method return a promise of object containing history data.
 *
 * @param  {object } req -request
 *
 * @param { object } res - response
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
