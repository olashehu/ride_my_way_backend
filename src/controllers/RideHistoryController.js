import Model from '../models/model';

const RideHistoryModel = new Model('ride_history');
export const DriverRideHistoryPage = async (req, res) => {
  const { id } = req.user.driver;
  try {
    const data = await RideHistoryModel.select('*', `WHERE "driver_id" = '${id}'`);
    res.status(200).json({ msg: data.rows });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};

export const UserRideHistoryPage = async (req, res) => {
  const { id } = req.user;
  try {
    const data = await RideHistoryModel.select('*', `WHERE "user_id" = '${id}'`);
    res.status(200).json({ msg: data.rows });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};

export const addHistory = async (req, res) => {
  const {
    driverId, offerId, userId, destination, price, status
  } = req.body;
  const columns = 'driver_id, offer_id, user_id, destination, price, status';
  const values = `'${driverId}', '${offerId}', '${userId}', '${destination}', '${price}', '${status}'`;
  try {
    const data = await RideHistoryModel.insertWithReturn(columns, values);
    res.status(200).json({ msg: data.rows });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};
