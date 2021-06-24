import Model from '../models/model';

const driverOfferModel = new Model('ride_offer');
/**
 *
 * @param {object} req - request
 * @param {object} res - response
 * @return Added data to database back
 */
export const addOffer = async (req, res) => {
  const { id } = req.user.driver;
  const {
    driverId, destination, price
  } = req.body;
  const columns = 'driver_id, destination, price';
  const values = `'${driverId}', '${destination}', '${price}'`;
  if (!id) {
    res.status(400).json({ message: 'Invalid token, please login' });
  }
  try {
    const data = await driverOfferModel.insertWithReturn(columns, values);
    res.status(200).json({ message: data.rows });
  } catch (err) {
    res.status(400).json({ message: err.stack });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
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
 *
 * @param {object*} req - requst
 * @param {object} res - response
 */
 export const editOffers = async (req, res) => {
   const { destination, price } = req.body;
   const driverId = req.user.driver.id;
   const { id } = req.params;
   try {
     const data = await driverOfferModel
       .update(`destination = '${destination}', price = '${price}' WHERE "id" = '${id}' AND "driver_id" = '${driverId}' `);
       if(!data.rowCount) {
         return res.status(401).json({message: `The give id of ${id} does not match`});
       }
     return res.status(200).json({ message: 'You have updated offer successfully' });
   } catch (err) {
     res.status(400).json({ message: err.stack });
   }
 };

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
