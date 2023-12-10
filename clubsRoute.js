// LOAD DOTENV
require('dotenv').config();



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
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

function removeReturn(req, res) {
  req.session.loginReturnURL = null;
}

// LOAD MYSQL MODULES AND CONNECT TO DB

const { adminConnection, connection } = require('./database');



const viewClubsGet = async (req, res) => {
  const query = "SELECT * FROM `clubs`";
  adminConnection.query(query, async (error, results) => {
    var clubs = results;
    res.render('clubs', { clubs: clubs })
  })
}



module.exports = {
  viewClubsGet,
}