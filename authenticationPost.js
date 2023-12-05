// LOAD DOTENV
require('dotenv').config();



// LOAD BCRYPT
const bcrypt = require('bcrypt')




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
function isValidEmail(email) {
  // Regular expression for a simple email validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function removeReturn(req, res) {
  req.session.loginReturnURL = null;
}

// LOAD MYSQL MODULES AND CONNECT TO DB
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.defaultHost,
  user: process.env.defaultUser,
  password: process.env.defaultPassword,
  database: process.env.defaultDatabase
});

const adminconnection = mysql.createConnection({
  host: process.env.adminHost,
  user: process.env.adminUser,
  password: process.env.adminPassword,
  database: process.env.adminDatabase,
});

connection.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('MySQL connection lost');
    // Re-establish the connection
    connection.connect();
  } else {
    throw err;
  }
});

adminconnection.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('MySQL connection lost');
    // Re-establish the connection
    connection.connect();
  } else {
    throw err;
  }
});

function accountNotVerified(req, res, email) {
  req.session.email = email;
  req.session.accountPresent = true;
  req.session.accountVerified = false;
}
function logInAccount(req, res, email) {
  req.session.loggedIn = true;
  req.session.email = email;
}

const loginPost = async (req, res) => {
  const { email, password } = req.body;
  if (!isValidEmail(email)) {
    if(email === process.env.adminEmail){
      // Admin attempting to log in, don't stop it
    }
    else {
      res.render('login', { actionError: "That email is not valid." })
    }
  }
  const query = `SELECT * FROM users WHERE email = ?`;
  connection.query(query, [email], async (error, results) => {
    if (error) {
      console.error(error);
      res.render('login', { actionError: `Error logging in: ${error}` })
    }

    try {
      if (results.length === 1) {
        const storedPassword = results[0].password;
        const passwordMatch = await bcrypt.compare(password, storedPassword);
        if (passwordMatch) {
          if (results[0].isVerified === "false" | results[0].isVerified === false) {
            await accountNotVerified(req, res, email);
            res.redirect('/verify')
            return;
          }
          else {
            await logInAccount(req, res, email)
            if (req.session.loginReturnURL != null && req.session.loginReturnURL != undefined) {
              const returnUrl = req.session.loginReturnURL;
              await removeReturn(req, res)
              return res.redirect(returnUrl)
            }
            else { return res.redirect('/') };
          }
        } else {
          res.render('login', { actionError: "Incorrect password for that email." })
        }
      } else {
        res.render('login', { actionError: "No user with that email exists." })
      }
    } catch (error) {
      console.error(error);
      res.render('login', { actionError: `Error logging in: ${error}` })
    }
  });
};

const generateRandomSixDigitNumber = () => {
  const min = 100000; // Minimum value (inclusive)
  const max = 999999; // Maximum value (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const registerPost = async (req, res) => {
  try {

    const { email, password, country, city, state, name } = req.body;
    var nullError = "Please make sure that you have entered your country and city."
    var noPassError = "Please enter a password."
    var noEmailError = "Please enter a valid email."
    var noNameError = "Please enter a name."
    if(password === null || password === undefined || password === ""){
      res.render('register', { actionError: noPassError })
    }
    if(name === null || name === undefined || name === ""){
      res.render('register', { actionError: noNameError })
    }
    if(email === null || email === undefined || email === "" || !isValidEmail(email)){
      res.render('register', { actionError: noEmailError })
    }
    else if (country && city === null || country && city === undefined || country && city === "") {
      res.render('register', { actionError: nullError })
    }
    else if (city === null || city === undefined || city === "") {
      res.render('register', { actionError: nullError })
    }
    else if (country === null || country === undefined || country === "") {
      res.render('register', { actionError: nullError })
    }
    else {

      const query = `SELECT * FROM users WHERE email = ?`;
      connection.query(query, [email], async (error, results) => {
        if (error) {
          console.error(error);
          res.redirect(process.env.registerPage, { actionError: error })
        } else {
          if (results.length > 0) {
            res.render('register', { actionError: "A user with that email already exists." })
          } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const verificationCode = generateRandomSixDigitNumber();
            const insertQuery = 'INSERT INTO users (name, email, password, verificationCode, isVerified, country, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(insertQuery, [name, email, hashedPassword, verificationCode, "false", country, city, state], async (error, results) => {
              if (error) {
                console.error(error);
                res.render('register', { actionError: error })
              } else {
                // req.session.loggedIn = true;
                req.session.email = email;
                req.session.accountPresent = true;
                req.session.accountVerified = false;
                const contents = `
<div class="container">
  <div class="content">
    <h1>Thanks for signing up!</h1>
    <p>Dear User,</p>
    <p>Thank you for signing up for the Ohio Chess Club.</p>
    <p>Verification code: ${verificationCode}</p>
    <p>If you have any questions or need assistance, feel free to contact our support team.</p>
  </div>
  <div class="footer">
    <p>This email was sent to you by the <b>Ohio Chess Club</b>.</p>
    <p>Please do not reply to this email.</p>
  </div>
</div>
  `

                const info = await transporter.sendMail({
                  from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
                  to: email,
                  subject: "Verification Code",
                  html: contents,
                });

                res.redirect('/verify');

              }
            });
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.render('register', { actionError: error })
  }
};
const verifyPost = async (req, res) => {

  const { enteredCode } = req.body;
  if (enteredCode === null || enteredCode.length > 6 || enteredCode < 0) {
    var actionError = "Number cannot be less than zero or more than six characters."
    res.render('verify', { actionError: actionError, email: req.session.email })
    return
  }
  else if (req.session.email === null | req.session.email === undefined) {
    res.redirect('login')
    return
  }
  const sqlcorrectverify = "UPDATE `users` SET `isVerified` = 'true' WHERE `users`.`email` = ?;";
  const checkcodesql = "SELECT * FROM users WHERE email = ?;";

  connection.query(checkcodesql, [req.session.email], async (error, results) => {
    if (error) {
      console.log(error);
      res.redirect('verify');
      return;
    }

    const code = results[0].verificationCode.toString();

    if (enteredCode === code) {
      adminconnection.query(sqlcorrectverify, [req.session.email], async (error, results) => {
        if (error) {
          console.log(error);
          res.redirect('verify');
          return;
        }
        const contents = `
          <div class="container">
            <div class="content">
              <h1>Thanks for signing up!</h1>
              <p>Dear User,</p>
              <p>Thank you for verifying your email for the Ohio Chess Club.</p>
              <p>If you have any questions or need assistance, feel free to contact our support team.</p>
            </div>
            <div class="footer">
              <p>This email was sent to you by the <b>Ohio Chess Club</b>.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
            `
        const info = await transporter.sendMail({
          from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
          to: req.session.email,
          subject: "Email Verified",
          html: contents,
        });

        req.session.loggedIn = true;
        res.redirect('/login');
      });
    } else {
      res.render('verify', { actionError: "Incorrect code. Try again.", email: req.session.email });
    }
  });
};







module.exports = {
  registerPost,
  loginPost,
  verifyPost
};


