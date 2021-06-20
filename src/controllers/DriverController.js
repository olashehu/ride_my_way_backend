import jwt from 'jsonwebtoken';
import Model from '../models/model';

const secretKey = process.env.SECRET_KEY;
const driverModel = new Model('drivers');

export const addDriver = async (req, res) => {
  const {
    firstName, lastName, address, phone, email, password
  } = req.body;
  const columns = 'first_name, last_name, address, phone, email, password';
  const values = `'${firstName}', '${lastName}', '${address}', '${phone}', '${email}', '${password}'`;
  try {
    const data = await driverModel.insertWithReturn(columns, values);
    const { id } = data.rows[0];
    const token = jwt.sign({
      id,
      email
    }, secretKey, {
      expiresIn: '24h'
    });
    res.status(200).json({
      id,
      email,
      token,
      message: 'Account created successfully!'
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
