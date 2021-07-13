import Model from '../models/model';

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
  const { destination, price } = req.body;
  const columns = '"driverId", destination, price';
  const values = `'${id}', '${destination}', '${price}'`;
  try {
    const data = await offerModel.insertWithReturn(columns, values);
    return res.status(201)
      .json({ data: data.rows[0], message: 'offer created successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/**
 * @description - This method will return offer for a particular driver
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @return {object} - it return object
 */
export const DriverRideOfferPage = async (req, res) => {
  const { data: { id } } = req.user;
  try {
    const data = await offerModel.select('*', `WHERE "driverId" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'offer does not exist', success: false }
      );
    }
    return res.status(200).json({
      data: data.rows, success: true
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  let total;
  try {
    const data = await offerModel.select('*');
    total += data.rowCount;
    if (!data.rowCount) {
      return res.status(200).json(
        { data: [], message: 'offer does not exist', success: false }
      );
    }
    return res.status(200).json({ data: data.rows, total, success: true, });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/**
 * @description - The method handle the request for editing a offer
 *
 *@return {object} - it return object message

 * @param {object} req - request

 * @param {object} res - response
 */
export const editOffers = async (req, res) => {
  const driverId = req.user.data.id;
  const { id } = req.params;
  try {
    const data = await offerModel
      .update(req.body, `WHERE "driverId" = '${driverId}' AND id = '${id}'`);
    if (!data.rowCount) {
      return res.status(404).json(
        { data: [], message: 'no offer to update', success: false }
      );
    }
    return res.status(200).json({ message: 'You have updated offer successfully', success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @description - This method delete a particular offer for a driver
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 * @returns {object} - it return object message
 */
export const deleteOffer = async (req, res) => {
  const driverId = req.user.data.id;
  const { id } = req.params;
  try {
    const data = await offerModel
      .deleteTableRow(`WHERE "driverId" = '${driverId}' AND id = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'no offer to delete', success: false }
      );
    }
    return res.status(200).json({ message: 'offer deleted successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
