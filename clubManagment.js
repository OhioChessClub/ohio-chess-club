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

function removeReturn(req, res) {
  req.session.loginReturnURL = null;
}

const {
  usersModel,
  unverifiedclubsModel,
  clubsModel
} = require('./database')


function applyRes(req, res) {
  req.session.loginReturnURL = `/apply`;
}
async function checkAccess(req, res) {
  try {
    const query = { email: req.session.email }
    const results = await usersModel.find(query)
    if (results.length > 0) {
      return true
    } else {
      return false
    }
  }
  catch (error) {
    if (error) {
      console.log(error);
      reject(error);
    }
  }

}

const createClubPost = async (req, res, accountInfo) => {
  var publiclyAvaliable = true;

  if (publiclyAvaliable === true) {
    try {

      await checkUserFile.checkForUser(req, res);

      const { clubName, clubOwnerName, clubDescription } = req.body;
      const ownerEmail = req.session.email;
      if (ownerEmail === null || ownerEmail === undefined) {
        res.redirect('login');
        return;
      }

      const club = new unverifiedclubsModel({
        clubName: clubName,
        clubOwnerName: clubOwnerName,
        clubDescription: clubDescription,
        ownerEmail: ownerEmail
      })
      club.save();

      const contents = `
    <h1>Hi, ${clubOwnerName}</h1>
    <h2>Your club, ${clubName} is being reviewed.</h2>
    <br><br>
    <h3>Other information:</h3>
    <h4>Club Description: ${clubDescription}</h4>
    <h4>Owner email: ${ownerEmail}</h4>
    `
      await transporter.sendMail({
        from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
        to: ownerEmail,
        subject: "Club is being reviewed",
        html: contents,
      });

      res.redirect('/club-created')
    }
    catch (error) {
      res.render('applyForClub', { actionError: "There was an error creating your club. Feel free to contact us for help. Error: " + error, accountInfo })
    }
  } else {
    res.render('applyForClub', { actionError: "Creating clubs is not avaliable to the public at this time.", accountInfo })
  }
}

const clubApplyGet = async (req, res, accountInfo) => {
  if (!req.session.loggedIn) {
    await applyRes(req, res);
    await checkUserFile.checkForUser(req, res);
  }
  else {
    try {
      const query = { email: req.session.email }
      var results = await unverifiedclubsModel.find(query)
      if (results[0] != undefined || results[0] != null) {
        res.redirect('manage-club')
      }
      if (results[0] === undefined || results[0] === null) {
        if (results[0] === undefined || results[0] === null) {
          const query = { ownerEmail: req.session.email }
          var results = await clubsModel.find(query)
          if (results.length > 0) {
            res.redirect('/manage-club');
          } else {
            res.render('applyForClub', { clubActive: false, accountInfo });
          }
        }
      }
    }
    catch (error) {
      if (error) {
        res.render('applyForClub', { clubActive: "error", accountInfo })
        return;
      }
    }
  }
}

const clubCreatedGet = async (req, res, accountInfo) => {
  try {
    if (!req.session.loggedIn) {
      await applyRes(req, res);
      await checkUserFile.checkForUser(req, res);

      if (res.headersSent) {
        res.render('login', accountInfo);
      }
    }
    else {
      const query = { ownerEmail: req.session.email }
      const results = await unverifiedclubsModel.find(query)
      if (results[0] != undefined || results[0] != null) {
        res.render('beingReviewed', accountInfo)
      }
      if (results[0] === undefined || results[0] === null) {
        res.redirect('/')
        console.log("CLUB CREATED ERROR")
      }
    }
  }
  catch (error) {
    if (error) {
      res.redirect('/')
      console.log("CLUB CREATED ERROR")
    }
  }
};

function removeEmailError(req, res) {
  req.session.errorEmailUsed = false;
}

const clubManageGet = async (req, res, accountInfo) => {
  if (!req.session.loggedIn) {
    // await applyRes(req, res);
    await applyRes(req, res)
    await checkUserFile.checkForUser(req, res);
  }
  else {
    try {
      const query = { ownerEmail: req.session.email }
      var results = await unverifiedclubsModel.find(query);
      if (results[0] != undefined || results[0] != null || results[0] === "") {
        res.render('manageClubUnverified', { accountInfo })
      }
      else if (results[0] === undefined || results[0] === null || results[0] === "") {
        const query = { ownerEmail: req.session.email }
        var results = await clubsModel.find(query)
        if (results.length > 0) {
          let emailUsed = false;
          if (req.session.errorEmailUsed === true) {
            emailUsed = true;
          }
          await removeEmailError(req, res);
          res.render('manageClub', {
            clubName: results[0].clubName,
            clubOwnerName: results[0].clubOwnerName,
            clubDescription: results[0].clubDescription,
            ownerEmail: results[0].ownerEmail,
            emailUsed: emailUsed,
            accountInfo
          });
        } else {
          res.redirect('/apply');
        }

      }
    }
    catch (error) {
      if (error) {
        res.redirect('/')
        console.log(error)
      }
    }
  }
};

const updateInfoPost = async (req, res, accountInfo) => {
  try {
    const { clubName, clubOwnerName, clubDescription } = req.body;
    if (!req.session.loggedIn) {
      await applyRes(req, res);
      await checkUserFile.checkForUser(req, res);

      if (res.headersSent) {
        res.render('login', accountInfo);
      }
    }
    else {
      const query = { ownerEmail: req.session.email };
      var results = await clubsModel.find(query)
      if (results.length > 0) {
        const query = { ownerEmail: req.session.email } 
        await clubsModel.findOneAndUpdate(query, {
          clubName: clubName,
          clubOwnerName: clubOwnerName,
          clubDescription: clubDescription
        })
        res.redirect('manage-club')
      }
    }
  }
  catch (error) {
    if (error) {
      res.send('Unknown error, contact Cole or support.');
      console.log(error);
    }
  }
}

function emailUsedError(req, res) {
  req.session.errorEmailUsed = true;
}




module.exports = {
  createClubPost,
  clubApplyGet,
  clubCreatedGet,
  clubManageGet,
  updateInfoPost,
}