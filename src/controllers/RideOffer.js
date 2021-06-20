import Model from '../models/model';

const driverOfferModel = new Model('ride_offer');
export const addOffer = async (req, res) => {
  const {
    driverId, destination, price
  } = req.body;
  const columns = 'driver_id, destination, price';
  const values = `'${driverId}', '${destination}', '${price}'`;
  try {
    const data = await driverOfferModel.insertWithReturn(columns, values);
    res.status(200).json({ msg: data.rows });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};

export const DriverRideOfferPage = async (req, res) => {
  const { id } = req.user.driver;
  try {
    const data = await driverOfferModel.select('*', `WHERE "driver_id" = '${id}'`);
    res.status(200).json({ msg: data.rows });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};

export const modifyOfferpage = async (req, res) => {
  const { destination, price } = req.body;
  const { id } = req.params;
  const columns = 'destination, price,';
  const values = `'${destination}', '${price}'`;
  try {
    const data = await driverOfferModel.update(columns, values, `WHERE "driver_id" = '${id}'`);
    console.log(data);
    res.status(200).json({ msg: data.rows });
  } catch (err) {
    res.status(400).json({ msg: err.stack });
  }
};

// export const deleteOffer = async (req, res) => {
//   const { id } = req.params;
//   console.log(id);
//   try {
//     const data = await driverOfferModel.deleteTableRow(`WHERE "driver_id" = '${id}'`);
//     console.log(data);
//     res.status(200).json({ msg: data.rows });
//   } catch (err) {
//     res.status(400).json({ msg: err.stack });
//   }
// };
