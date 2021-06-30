import Model from '../models/model';

const driverOfferModel = new Model('ride_offer');
/**
 * @description - This method will handle the request for adding offers to the database
 * and return object of offer added
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {object} - it return data of object which is a result of a
 * promise
 */
export const addOffer = async (req, res) => {
  const { id } = req.user.data;
  const {
    driverId, destination, price
  } = req.body;
  const columns = 'driver_id, destination, price';
  const values = `'${driverId}','${destination}', '${price}'`;
  try {
    const data = await driverOfferModel.insertWithReturn(columns, values);
    if (id === data.rows[0].driver_id) {
      return res.status(200).json({ message: data.rows });
    }
    return res.status(400)
      .json({ message: 'Access denied, please, Register or Login', success: false });
  } catch (err) {
    res.status(400).json({ message: err.stack });
  }
};
/**
 * @description - This method will handle the request coming to the url and fetch
 * data which is an object and return a promise object
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {object} - it return object
 */
export const DriverRideOfferPage = async (req, res) => {
  const { id } = req.user.data;
  try {
    const data = await driverOfferModel.select('*', `WHERE "driver_id" = '${id}'`);
    if (id !== data.rows[0].driver_id) {
      return res.status(400).json({ message: 'Request Failed', success: false });
    }
    return res.status(200).json({
      message: data.rows
    });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};
/**
 *@description - This method handle the request for getting all offers in the database
 and return a object which is a result of a promise.

 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - a promise of all offer object containing offers data
 */
export const allOffer = async (req, res) => {
  try {
    const data = await driverOfferModel.select('*');
    if (!data.rowCount) {
      return res.status(400).json({ message: 'failed', success: false });
    }
    return res.status(200).json({ message: data.rows, success: true, });
  } catch (err) {
    res.status(400).json({ message: err.stack });
  }
};
/**
 * @description - The method handle the request for editing a offer
 *
 *@return {obj}- it return success message if the given id matches or invaild

 * @param {object} req - request

 * @param {object} res - response
 */
export const editOffers = async (req, res) => {
  const driverId = req.user.data.id;
  const { id } = req.params;
  try {
    const data = await driverOfferModel.update(req.body, `WHERE "driver_id" = '${driverId}'`);
    if (!data.rowCount) {
      return res.status(400).json({ message: `The give id of ${id} does not match` });
    }
    return res.status(200).json({ message: 'You have updated offer successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.stack });
  }
};

/**
 * @description - This method handle the request for deleting a offer and
 * return a success message if the given id matches the id of deleting item
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {message} - it return a success message if the given id is valid or not match
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
