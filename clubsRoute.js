// LOAD DOTENV
require('dotenv').config();

const {
  clubsModel
} = require('./database')

// LOAD BCRYPT
const bcrypt = require('bcrypt')


const checkUserFile = require('./checkForUser');


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
function removeReturn(req, res) {
  req.session.loginReturnURL = null;
}


const viewClubsGet = async (req, res, accountInfo, title, description, canonicalUrl) => {
  var clubs = await clubsModel.find()
  res.render('clubs', { title, description, clubs: clubs, accountInfo, canonicalUrl })
}



module.exports = {
  viewClubsGet,
}