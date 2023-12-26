// REQUIRE STATMENTS AND IMPORTS
require('dotenv').config()
const nocache = require('nocache');
const express = require('express');
const app = express();
const session = require('express-session')
const ejs = require('ejs')
const staticFiles = require('./staticFiles');
const databaseHelper = require('./database');
const authenticationPost = require('./authenticationPost');
const adminUpdates = require('./adminUpdates');
const clubManagment = require('./clubManagment');
const contact = require('./contact');
const authenticationGet = require('./authenticationGet');
const clubs = require('./clubsRoute');
const homeRoute = require('./homeRoute');
const admin = require('./adminRoutes');
const bodyParser = require('body-parser')
const {
  viewsModel
} = require('./database')

// DECLARE DESCRIPTION AND TITLE MAPS

const titleMap = {
  // "viewFileName": "viewTItle"
  "404": "404: Page not found",
  "applyForClub": "Apply as Club Owner",
  "beingReviewed": "Your club is being reviewed.",
  "clubs": "Clubs",
  "contact": "Contact",
  "forgotPassword": "Reset your Password",
  "index": "Ohio Chess Club",
  "introductory-video-not-released": "Introductory Video",
  "introductory-video": "Introductory Video",
  "login": "Login",
  "manageClub": "Manage your Club",
  "manageClubUnverified": "Your club has not been verified",
  "register": "Register",
  "siteNotPublic": "Ohio Chess Club",
  "verify": "Verify your Email"
}

const descMap = {
  // "viewFileName": "viewTItle"
  "404": "We cannot find this page on our servers.",
  "applyForClub": "Apply to be a club owner on the Ohio Chess Club.",
  "beingReviewed": "Your club you created is being reviewed for the Ohio Chess Club.",
  "clubs": "View all the clubs on the Ohio Chess Club.",
  "contact": "Contact the Ohio Chess Club.",
  "forgotPassword": "Change your account's password on the Ohio CHess Club.",
  "index": "The Ohio Chess club is the best completely free chess learning community.",
  "introductory-video-not-released": "View the Introductory Video.",
  "introductory-video": "View the Introductory Video.",
  "login": "Login to the Ohio Chess Club",
  "manageClub": "Manage your club on the Ohio Chess Club.",
  "manageClubUnverified": "Manage your club on the Ohio Chess Club.",
  "register": "Register an account for the Ohio Chess Club",
  "siteNotPublic": "The Ohio Chess club is the best completely free chess learning community.",
  "verify": "Verify your Email to Login to the Ohio Chess Club"
}

// DECLARE TITLE FINDING HELPER FUNCTIONS
function getTitleFromFile(fileName) {
  if (titleMap.hasOwnProperty(fileName)) {
    return titleMap[fileName]
  }
  else {
    return "Non-Existant"
  }
}
function getDescFromFile(fileName) {
  if (descMap.hasOwnProperty(fileName)) {
    return descMap[fileName]
  }
  else {
    return "Non-Existant"
  }
}

// Example of Getting Title from File Name:
// var fileName = "login"
// var test = getTitleFromFile(fileName)
// console.log(test)

// Example of Getting Desc from File Name:
// var fileName = "login"
// var test = getDescFromFile(fileName)
// console.log(test)

// DECLARE NESSESARY VARIABLES AND CONFIG EXPRESS AS NEEDED

app.use(session({
  secret: 'WEqwewqewq4F5WEQWEFQW',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})
app.use(staticFiles)
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(nocache());

// FALSE: WEBSITE IN "LOCKDOWN" COULD BE USED FOR BIG ISSUES OR NOT RELEASED YET
// TRUE: WESITE FUNCTIONS LIKE NORMAL
var isPublic = true;


if (isPublic) {
  // FUNCTIONS
  async function updateViews(req, res) {
    try {
      var query = { id: 1 }
      var results = await viewsModel.find(query)
      var currentViews = results[0].totalViews;
      var newViews = currentViews + 1;
      await viewsModel.findOneAndUpdate(query, { totalViews: newViews })
    }
    catch (error) {
      if (error) {
        console.log("Error adding to views.")
      }
    }
  }
  function checkForAdmin(req, res, next) {
    if (req.session.loggedIn) {
      if (req.session.email === process.env.adminEmail) {
        return 'Authorized';
      }
    }
    else {
      return 'Unauthorized'
    }
  }
  (async () => {
    const isConnected = await databaseHelper.connect();
    if (isConnected === "Connected") {
      console.log("Server file has confirmed that database has connected.");
    }
  })()

  // POST REQUESTS
  app.post('/register', authenticationPost.registerPost);
  app.post('/login', authenticationPost.loginPost);
  app.post('/verify', authenticationPost.verifyPost);
  app.post('/forgotpasswordpost', authenticationPost.forgotPasswordPost);
  app.post('/updatefeaturetitleanddesc', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatefeaturetitleanddesc(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })
  app.post('/updatecoursestitleanddesc', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatecoursestitleanddesc(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })
  app.post('/updatemaintitleanddesc', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatemaintitleanddesc(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })
  app.post('/updatemainbuttontext', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatemainbuttontext(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })
  app.post('/updatefeaturedata', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatefeaturedata(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })
  app.post('/updatecoursesdata', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatecoursesdata(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })
  app.post('/fulfillQuestion', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.markContactResolved(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })
  app.post('/verifyClub', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.verifyClub(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })
  app.post('/apply', clubManagment.createClubPost);
  app.post('/updateBasicInfo', clubManagment.updateInfoPost);
  app.post('/contact', contact.contactPost)

  // GET REQUESTS
  app.get('/register', async (req, res) => {
    await updateViews();
    authenticationGet.registerGet(req, res)
  });
  app.get('/login', async (req, res) => {
    await updateViews();
    authenticationGet.loginGet(req, res)
  });
  app.get('/verify', async (req, res) => {
    await updateViews();
    authenticationGet.verifyGet(req, res)
  });
  app.get('/clubs', async (req, res) => {
    await updateViews();
    clubs.viewClubsGet(req, res)
  });
  app.get('/', async (req, res) => {
    await updateViews();
    homeRoute.homeRoute(req, res)
  });
  app.get('/introductory-video', (req, res) => {
    var isAdmin = checkForAdmin(req, res);
    if (isAdmin === 'Authorized') {
      res.render('introductory-video')
    }
    else {
      res.render('introductory-video-not-released')
    }
  })
  app.get('/apply', async (req, res) => {
    await updateViews();
    clubManagment.clubApplyGet(req, res)
  });
  app.get('/club-created', async (req, res) => {
    await updateViews();
    clubManagment.clubCreatedGet(req, res)
  });
  app.get('/manage-club', async (req, res) => {
    await updateViews();
    clubManagment.clubManageGet(req, res)
  });
  app.get('/admin', async (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      admin.admin(req, res)
    }
    else {
      await updateViews()
      res.status(404).render('404')
    }
  })
  app.get('/contact', async (req, res) => {
    await updateViews(req, res);
    res.render('contact')
  })
  app.get('/sitemap.xml', (req, res) => {
    res.sendFile('C:\\Users\\colew\\OneDrive\\Documents\\dev-projects\\server\\sitemap.xml')
  })
  app.get('/socketScript', (req, res) => {
    res.sendFile('C:\\Users\\colew\\OneDrive\\Documents\\dev-projects\\server\\socket.js')
  })
  app.get('/chessScript', (req, res) => {
    res.sendFile('C:\\Users\\colew\\OneDrive\\Documents\\dev-projects\\server\\chess.js')
  })
  app.get('/chess', (req, res) => {
    res.render('chess')
  })
  app.get('/reconnectToDatabase', (req, res) => {
    console.log(databaseHelper)
    res.render('reconnect', {
      databaseHelper
    })
  })
  app.use(async (req, res) => {
    await updateViews()
    res.status(404).render('404.ejs');
  });
}
else if (isPublic === false) {
  app.get('/', (req, res) => {
    res.render('siteNotPublic')
  });
  app.get('/css/allFrontend.css', (req, res) => {
    res.sendFile('C:\\Users\\colew\\OneDrive\\Documents\\server\\views\\allFrontend.css');
  })
  app.use(async (req, res) => {
    // res.status(404).render('404.ejs');
    res.redirect('/')
  });
}
else {
  console.log("Error Starting Application. isPublic incorrectly defined. Correct values: true; false || Boolean... not a string.")
}

const port = 3000;
// const port = 80;
app.listen(port)
console.log(`Listening on port: ${port}`)