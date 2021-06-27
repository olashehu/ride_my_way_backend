import Model from '../models/model';

const driverOfferModel = new Model('ride_offer');
/**
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {obj} Added data to database back
 */
export const addOffer = async (req, res) => {
  const { id } = req.user.driver;
  const {
    driverId, destination, price
  } = req.body;
  const columns = 'driver_id, destination, price';
  const values = `'${driverId}', '${destination}', '${price}'`;
  try {
    const data = await driverOfferModel.insertWithReturn(columns, values);
    res.status(200).json({ message: data.rows });
  } catch (err) {
    res.status(400).json({ message: err.stack });
  }
};
/**
 * @param {obj} req - request
 *
 * @param {obj} res - response
 *
 * @return {obj} - return a promise
 */
export const DriverRideOfferPage = async (req, res) => {
  const { id } = req.user.driver;
  try {
    const data = await driverOfferModel.select('*', `WHERE "driver_id" = '${id}'`);
    res.status(200).json({
      message: data.rows
    });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};
/**
 *@description - get all offers in the database

 * @param {obj} req - request
 *
 * @param {obj} res - response
 *
 * @returns {obj} - a promise of all offer object containing offers data
 */
export const allOffer = async (req, res) => {
  try {
    const data = await driverOfferModel.select('*');
    if (!data.rowCount) {
      return res.status(400).json({ message: 'failed', success: false });
    }
    return res.status(200).json({ message: data.rows, success: true, });
  } catch (error) {
    console.log(error.message);
  }
};
/**
 *@return {obj}- it return success message if the given id match or invaild

 * @param {object} req - request

 * @param {object} res - response
 */
export const editOffers = async (req, res) => {
  const { destination, price } = req.body;
  const driverId = req.user.driver.id;
  const { id } = req.params;
  try {
    const checkData = await driverOfferModel.select('*', `WHERE driver_id = '${driverId}'`);
    console.log(checkData.rows);
    const data = await driverOfferModel
      // eslint-disable-next-line max-len
      .update(`destination = '${destination}', price = '${price}' WHERE "id" = '${id}' AND "driver_id" = '${driverId}' `);
    if (!data.rowCount) {
      return res.status(401).json({ message: `The give id of ${id} does not match` });
    }
    return res.status(200).json({ message: 'You have updated offer successfully' });
  } catch (err) {
    res.status(400).json({ message: err.stack });
  }
};

/**
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {obj} - it return a success message if the given id is valid or not match
 */
export const deleteOffer = async (req, res) => {
  const driverId = req.user.driver.id;
  const { id } = req.params;
  try {
    const data = await driverOfferModel
      .deleteTableRow(`WHERE driver_id = '${driverId}' AND id = '${id}'`);
    if (!data.rowCount) {
      return res.status(400).json({ message: `The given id of ${id} does not match` });
    }
    return res.status(200).json({ Message: 'Deleted Successfully' });
  } catch (err) {
    res.status(400).json({ Message: err.stack });
  }
};
