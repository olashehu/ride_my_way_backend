import Model from '../models/model';

/**
 *@import - my model class and create a new instance of that model.
 this represent ride_history table in my database
 */
const rideHistoryModel = new Model('ride_history');
// const offerModel = new Model('ride_offer');

/**
 * @description - This method return a particular driver ride-history
 *
 * @return {object} - it return history object

 * @param {object} req - request

 * @param {object} res - response
 */
export const DriverRideHistoryPage = async (req, res) => {
  const { id } = req.user.data;
  try {
    const data = await rideHistoryModel.select('*', `WHERE "driverId" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'You have not completed a ride', success: false }
      );
    }
    return res.status(201).json({ data: data.rows, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @description - it return a particular passenger ride-history object
 *
 * @return {object} - it return passenger history object
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 */
export const UserRideHistoryPage = async (req, res) => {
  const { id } = req.user.data;
  try {
    const data = await rideHistoryModel.select('*', `WHERE "userId" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404)
        .json({ data: [], message: 'You have not join a ride', success: false });
    }
    res.status(201).json({ data: data.rows, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
