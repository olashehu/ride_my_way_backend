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
  const { id } = req.user.data;
  try {
    const data = await RideHistoryModel.select('*', `WHERE "driverId" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'data does not exist', success: false }
      );
    }
    return res.status(200).json({ data: data.rows, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  const { id } = req.user.data;
  try {
    const data = await RideHistoryModel.select('*', `WHERE "userId" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json({ data: [], message: 'data does not exist', success: false });
    }
    res.status(200).json({ data: data.rows, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  const columns = '"driverId", "offerId", "userId", destination, price, status';
  const values = `
  '${driverId}', '${offerId}', '${userId}', '${destination}', '${price}', '${status}'`;
  try {
    const data = await RideHistoryModel.insertWithReturn(columns, values);
    res.status(200).json({ data: data.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
