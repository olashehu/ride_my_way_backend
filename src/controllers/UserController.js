import jwt from 'jsonwebtoken';
import Model from '../models/model';

const userModel = new Model('users');
const secretKey = process.env.SECRET_KEY;

export const addUsers = async (req, res) => {
  const {
    firstName, lastName, address, phone, email, password
  } = req.body;
  const columns = 'first_name, last_name, address, phone, email, password';
  const values = `'${firstName}', '${lastName}', '${address}', '${phone}', '${email}', '${password}'`;
  try {
    const data = await userModel.insertWithReturn(columns, values);
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
      message: 'User created successfully!'
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
