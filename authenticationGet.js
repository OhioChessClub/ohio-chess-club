// LOAD DOTENV
require('dotenv').config();



// LOAD EXPRESS AND DEFINE EXPRESS MODULES
const express = require('express')
const mysql = require('mysql')
const session = require('express-session')
const app = express();
const {
  usersModel
} = require('./database')

const loginGet = async (req, res) => {
  if (req.session.accountPresent) {
    if (req.session.accountVerified === false) {
      res.redirect('/verify')
    }
  }
  else if (!req.session.loggedIn) {
    res.render('login')
  }
  else { res.redirect('/') }
};
const registerGet = async (req, res) => {
  if (req.session.accountPresent) {
    if (req.session.accountVerified === false) {
      res.redirect('/verify')
    }
  }
  else if (!req.session.loggedIn) {
    res.render('register')
  }
  else { res.redirect('/') }

};
const verifyGet = async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect('/')
      return;
    }
    if (!req.session.loggedIn) {
      if (req.session.accountVerified === false) {
        const email = req.session.email; // Retrieve email from session or wherever it is stored

        if (!email) {
          res.redirect('login');
          return;
        }
        const query = { email: email }
        var results = await usersModel.findOne(query)

        if (results.length === 0 || results[0].password === undefined || results[0].password === null) {
          res.redirect('login');
          return;
        }

        if (req.session.loggedIn) {
          res.redirect('index');
          return;
        } else {
          res.render('verify', { email: req.session.email });
          return;
        }
      } else {
        res.redirect('login');
        return;
      }

    }
  } catch (error) {
    if (error) {
      console.log("VERIFY GET ERROR: " + error);
      res.redirect('login');
      return;
    }
  }
};

function applyRes(req, res) {
  req.session.loginReturnURL = `/apply`;

}

const checkUserFile = require('./checkForUser')

var userInfoGet = async (req, res) => {
  if (req.session.accountPresent) {
    //   req.session.email
    // req.session.accountPresent
    // req.session.accountVerified
    // req.sesssion.loggedIn
    var email = req.session.email;
    var verifiedStatus;
    if (req.session.accountVerified) {
      // User is fully verified
      verifiedStatus = "Verified"
    }
  }
  else {
    var userInfo = {
      status: "NotLoggedIn"
    }
  }
}

module.exports = {
  loginGet,
  registerGet,
  verifyGet
};

