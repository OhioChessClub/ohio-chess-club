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

const loginGet = async (req, res, accountInfo, title, description) => {
  if (req.session.accountPresent) {
    if (req.session.accountVerified === false) {
      res.redirect('/verify')
    }
  }
  else if (!req.session.loggedIn) {
    res.render('login', { accountInfo, title, description })
  }
  else { res.redirect('/') }
};
const registerGet = async (req, res, accountInfo, title, description) => {
  if (req.session.accountPresent) {
    if (req.session.accountVerified === false) {
      res.redirect('/verify')
    }
  }
  else if (!req.session.loggedIn) {
    res.render('register', { accountInfo, title, description })
  }
  else { res.redirect('/') }

};
const verifyGet = async (req, res, accountInfo, title, description) => {
  try {
    console.log(req.session)
    if (req.session.loggedIn) {
      res.redirect('/')
      return;
    }
    else if (!req.session.loggedIn) {
      if (req.session.accountVerified === false) {
        const email = req.session.email; // Retrieve email from session or wherever it is stored

        if (!email) {
          res.redirect('login');
          return;
        }
        console.log(email)
        const query = { email: email }
        var results = await usersModel.findOne(query)
        console.log(results)
        if (results.length === 0) {
          res.redirect('login');
          return;
        }


        res.render('verify', { email: req.session.email, accountInfo, title, description });
        return;

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

