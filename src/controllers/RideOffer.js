import Model from '../models/model';
import ModelTwo from '../models/modelTwo';

const offerToDriver = new ModelTwo('ride_offer', 'drivers')
const offerModel = new Model('ride_offer');

/**
 * @description - This method add offer to the database
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {object} - it return data object
 */
export const addOffer = async (req, res) => {
  const { data: { id } } = req.user;
  const { destination, price, location } = req.body;
  const columns = '"driverId", destination, price, location';
  const values = `'${id}', '${destination}', '${price}', '${location}'`;
  try {
    const data = await offerModel.insertWithReturn(columns, values);
    return res.status(201)
      .json({ data: data.rows[0], message: 'Offer created successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};
/**
 * @description - This method will return offer for a particular driver
 * from the database
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {object} - it return json object
 */
export const DriverRideOfferPage = async (req, res) => {
  const { data: { id } } = req.user;
  try {
    const data = await offerModel.select('*', `WHERE "driverId" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'Offer not found', success: false }
      );
    }
    return res.status(200).json({
      data: data.rows, success: true
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

export const getSingleOffer = async (req, res) => {
  const driverId = req.user.data.id;
  const { id } = req.params;
  try {
    const data = await offerModel.select('*', `WHERE "driverId" = '${driverId}' AND id = '${id}'`);
    if(data.rowCount === 0) {
      return res.status(404).json({
        data: [],
        message: `Offer with id of ${id} does not exist`,
        status: false
      })
    }
    return res.status(200).json({
      data: data.rows,
      success: true
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

/**
 * @description - The method handle the request for editing a offer

 * @param {object} req - request

 * @param {object} res - response

 * @returns {object} - it return json object
 */
export const editOffers = async (req, res) => {
  const driverId = req.user.data.id;
  const { id } = req.params;
  try {
    const data = await offerModel
      .update(req.body, `WHERE "driverId" = '${driverId}' AND id = '${id}'`);
    if (!data.rowCount) {
      return res.status(404).json(
        { data: [], message: 'Offer not found', success: false }
      );
    }
    return res.status(200).json({
      data: data.rows[0],
      message: 'Offer updated successfully', 
      success: true 
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

/**
 * @description - This method delete a particular offer for a driver
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - it return json object
 */
export const deleteOffer = async (req, res) => {
  const driverId = req.user.data.id;
  const { id } = req.params;
  try {
    const data = await offerModel
      .deleteTableRow(`WHERE "driverId" = '${driverId}' AND id = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'Offer not found', success: false }
      );
    }
    return res.status(200).json({ message: 'Offer deleted successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

/**
 * @description - This method delete a particular offer for a driver
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - it return json object
 */
export const joinRideCard = async (req, res) => {
  const driverId = req.user.data.id;
  // const { id } = req.params;
  try {
    const data = await tableOfferToDrivers
    .selectJoin('location, destination, price, "firstName", "lastName", email, phone, drivers.id AS "driverId", ride_offer.id AS "offerId"', "driverId", 'id', ` WHERE ${driverId}="driverId"`);
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'Offer not found', success: false }
      );
    }
    return res.status(200).json({ data: data.rows, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

/**
 *@description - This method fetch and return all offer object

 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - it return a data object and the number of the data
 */
export const getAllOffer = async (req, res) => {
  let total = 0;
  try {
    const data = await offerToDriver.selectJoin('location, price, destination, "firstName", "lastName", phone, email, drivers.id AS "driverId", ride_offer.id AS "offerId"', "driverId", 'id');
    total += data.rowCount;
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'Offer not available', success: false }
      );
    }
    return res.status(200).json({ data: data.rows, total, success: true, });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};
