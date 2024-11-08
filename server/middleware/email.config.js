const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path=require('path')

dotenv.config({path:'../server/.env'});
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

module.exports={transporter}
