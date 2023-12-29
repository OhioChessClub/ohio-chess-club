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
    if (req.session.forgotPasswordSuccess) {
      var actionSuccess = req.session.forgotPasswordSuccess;
      req.session.forgotPasswordSuccess = null;
      res.render('login', { accountInfo, title, description, actionSuccess })
    }
    else {
    res.render('login', { accountInfo, title, description })      
    }

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

var forgotPasswordGet = async (req, res, accountInfo, title, description) => {
  if (req.session.accountPresent == true) {
    res.redirect('/')
  }
  else {
    if (req.session.forgotPasswordError) {
      var actionError = req.session.forgotPasswordError;
      req.session.forgotPasswordError = null;
      res.render('forgotPassword', { title, description, accountInfo, actionError })
    }
    if (req.session.forgotPasswordSuccess) {
      var actionSuccess = req.session.forgotPasswordSuccess;
      req.session.forgotPasswordSuccess = null;
      res.render('forgotPassword', { title, description, accountInfo, actionSuccess })
    }
    else {
      res.render('forgotPassword', { title, description, accountInfo })
    }

  }
}

var forgotPasswordLinkGet = async (req, res, accountInfo, title, description) => {
  if (req.session.accountPresent == true) {
    res.redirect('/')
  }
  else {
    const email = req.query.email;
    const key = req.query.key;
    if (email && key) {
      var filter = { email: email };
      var data = await usersModel.find(filter)
      if (data[0].changePasswordCode === parseInt(key)) {
        res.render('forgotPasswordLink', { title, description, accountInfo, email, key })
      }
      else {
        res.render('forgotPasswordUnauthorized', { title, description, accountInfo })
      }
    }
    else {
      res.render('forgotPasswordUnauthorized', { title, description, accountInfo })
    }

  }
}

module.exports = {
  loginGet,
  registerGet,
  verifyGet,
  forgotPasswordGet,
  forgotPasswordLinkGet
};

