import Model from '../models/model';

/**
 *@import - my model class and create a new instance of that model.
 this represent ride_history table in my database
 */
const rideHistoryModel = new Model('ride_history');

/**
 * @description - This method return a particular driver ride-history

 * @param {object} req - request

 * @param {object} res - response

* @return {object} - it return json object
 */
export const DriverRideHistoryPage = async (req, res) => {
  const { id } = req.user.data;
  try {
    const data = await rideHistoryModel.select('*', `WHERE "driverId" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'History not found', success: false }
      );
    }
    return res.status(200).json({ data: data.rows, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

/**
 * @description - it return a particular passenger ride-history object
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 *@returns {object} - it return json object
 */
export const UserRideHistoryPage = async (req, res) => {
  const { id } = req.user.data;
  try {
    const data = await rideHistoryModel.select('*', `WHERE "userId" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404)
        .json({ data: [], message: 'History not found', success: false });
    }
    res.status(200).json({ data: data.rows, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};
