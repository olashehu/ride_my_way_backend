import Model from '../models/model';
import ModelTwo from '../models/modelTwo';
import sendMail from '../email/NodeMailer';
import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

const htmlTemplate = fs.readFileSync(
    path.join(__dirname, `UserNotify.html`),
    'utf-8',
  );

  const rejectOfferTemplate = fs.readFileSync(
    path.join(__dirname, 'rejectOffer.html'),
    'utf-8',
  );

/**
 *@import - my model class and create a new instance of that model.
 this represent ride_history table in my database
 */
const rideHistoryModel = new Model('ride_history');
const joinHistoryToUser = new ModelTwo('ride_history', 'users');
/**
 * @description - This method return a particular driver ride-history

 * @param {object} req - request

 * @param {object} res - response

* @return {object} - it return json object
 */
// Join user table to this controller and extract user data from it. I will be doing this in the morning in office
export const DriverRideHistoryPage = async (req, res) => {
  const { id } = req.user.data;
  try {
    const data = await joinHistoryToUser.selectJoin('location, destination, price, "createdAt", status, "firstName", email, "lastName", phone, "driverId", users.id As "userId", ride_history.id AS "historyId"', "userId", "id", `WHERE "driverId" = '${id}' AND( status ='Pending' OR status='Accepted' OR status='Trip started')`);
    if (data.rowCount === 0) {
      return res.status(404).json(
        { data: [], message: 'History not found', success: false }
      );
    }
    return res.status(200).json({ data: data.rows, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

/**
 * @description - it return a particular passenger ride-history object
 *
 * @param {object} req - request
 *
 * @param {object} res - response
 *
 *@returns {object} - it return json object
 */
export const UserRideHistoryPage = async (req, res) => {
  const { id } = req.user.data;
  try {
    const data = await rideHistoryModel.select('*', `WHERE "userId" = '${id}'`);
    if (data.rowCount === 0) {
      return res.status(404)
        .json({ data: [], message: 'History not found', success: false });
    }
    res.status(200).json({ data: data.rows, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

export const acceptJoinOffer = async (req, res) => {
  const {id} = req.params;
  const { status} = req.body;
  const {userName} = req.body;
  const passengerEmail = req.body.email;
  const subject = "Trip Accepted";
  const emailTemplate = Mustache.render(htmlTemplate, {user: `${userName}`, driver: 'Mustache'});
  console.log(userName, passengerEmail, status, 'accepted offer');
  
  try {
    const data = await rideHistoryModel.update(status, `WHERE id='${id}'`);
    if (data.rowCount === 0) {
      return res.status(404).json({ data: [], message: 'Offer not found', success: false });
    } else if(data.rows[0].status === 'Accepted') {
      sendMail(passengerEmail, emailTemplate, subject, (err, data) => {
      if(err){
        return res.status(400).json({message: err.message, success: false})
      } else {
        return res.status(200).json({ message: 'offer accepted', success: true});
      }
    })
    }
    
  } catch (err) {
    console.log(error, 'error');
    res.status(500).json({ message: err.message, success: false });
  }
};

export const offerRejected = async (req, res) => {
  const { id } = req.params;
  const {status} = req.body;
  const{ userName} = req.body;
  const email = req.body.email;
  const subject = 'Trip Rejected';
  const emailTemplate = Mustache.render(rejectOfferTemplate, {user: `${userName}`, driver: 'Mustache'});

  try {
    const data = await rideHistoryModel.update(status, `WHERE id=${id}`);
    if (data.rowCount === 0) {
      return res.status(404).json({ data: [], message: 'Offer not found', success: false });
    } else {
      return sendMail(email, emailTemplate, subject, (err, data) => {
        if(err) {
          return res.status(404).json({message: err.message, success: false})
        } else {
           return res.status(200).json({ message: 'Offer Rejected', success: true});
        }
      })
    }
  } catch (error) {
    console.log(error, 'error message');
  }
}