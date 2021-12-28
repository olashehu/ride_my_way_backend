import nodemailer from 'nodemailer';
import mailGun from 'nodemailer-mailgun-transport';
import dotenv from 'dotenv';

dotenv.config();

const auth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN
  }
}

const transporter = nodemailer.createTransport(mailGun(auth));
const sendMail = (email, emailTemplate, subject, cb) => {
  const mailOptions = {
  from: "testridmyway@example.com",
  to: email,
  subject,
  html: emailTemplate
 };

 transporter.sendMail(mailOptions, (err, data)=>{
  if(err){
    cb(err, null);
  } else {
    cb(null, data);
  }
 })
}

export default sendMail;
