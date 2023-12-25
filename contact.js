// LOAD DOTENV
require('dotenv').config();



// LOAD BCRYPT
const bcrypt = require('bcrypt')


const {
  contactrequestsModel
} = require('./database')


// LOAD EXPRESS AND DEFINE EXPRESS MODULES
const express = require('express')
const session = require('express-session')
const nodeMailer = require('nodemailer')
const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'ohiochessclub@gmail.com',
    pass: 'kjodasdsoxunxpbm'
  }
});


const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

function removeReturn(req, res) {
  req.session.loginReturnURL = null;
}

const contactPost = async (req, res) => {
  try {
    var formEnabled = false;
    if(formEnabled === true){
      


    const { contactName, contactEmail, contactText } = req.body;
    const isFulfilled = 'n';


    const contents = `
<div class="container">
  <div class="content">
    <h1>Thanks for reaching out to us!</h1>
    <p>${contactName},</p>
    <p>Thank you for contacting the Ohio Chess Club.</p>
    <p>We have recieved your question and you will be reached out to within 24 hours at this email address.</p>
  </div>
  <div class="footer">
    <p>This email was sent to you by the <b>Ohio Chess Club</b>.</p>
    <p>Please do not reply to this email.</p>
  </div>
</div>
  `

    await transporter.sendMail({
      from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
      to: contactEmail,
      subject: "Your Question has Been Recieved",
      html: contents,
    });

    await importIntoDatabase(contactName, contactEmail, contactText, isFulfilled, req, res);

    var actionFinished = `Your request has been processed. You should be reached out to by email within 24 hours. A confirmation email has been sent to your email. (${contactEmail})`
    res.render('contact', {actionFinished});
    }
    else {
      var error = "The contact form is not avaliable to the public at this time."
      res.render('contact', {actionError: error})

    }

  }
  catch (error) {
    sendError(req, res, error)
  }
}

function sendError(req, res, error){
  console.log(`CONTACT ERROR: ` + error)
    var actionError = `There was an error sending your request. Our developers have been notified and are looking into it. We are sorry for the inconvienience.`;
    res.render('contact', {actionError})
}

function importIntoDatabase(contactName, contactEmail, contactText, isFulfilled, req, res){
  try {
  var contact = new contactrequestsModel({
    email: contactEmail,
    name: contactName,
    question: contactText,
    isFulfilled: isFulfilled
  })
  contact.save()
  }
  catch (error) {
    if(error){
      sendError(req, res, error)
      return;
    }
  }
}



module.exports = {
  contactPost
};


