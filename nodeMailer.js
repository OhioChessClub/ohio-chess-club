const nodeMailer = require('nodemailer')
const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.smtpAuthUser,
    pass: process.env.smtpAuthPass
  }
});

module.exports = {
    transporter
}