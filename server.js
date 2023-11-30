// LOAD DOTENV
require('dotenv').config()
const nocache = require('nocache');

// LOAD AND DEFINE EXPRESS MoDULES
const express = require('express');
const app = express();
const session = require('express-session')
const ejs = require('ejs')



// FALSE: WEBSITE IN "LOCKDOWN" COULD BE USED FOR BIG ISSUES OR NOT RELEASED YET
// TRUE: WESITE FUNCTIONS LIKE NORMAL
var isPublic = true;


const staticFiles = require('./staticFiles');
app.use(staticFiles)
const { raw } = require('mysql');
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

const databaseHelper = require('./database');
const connection = databaseHelper.connection;
const adminConnection = databaseHelper.adminConnection;
app.use(nocache());

if (isPublic) {

  async function updateViews(req, res) {
    var query1 = "SELECT * FROM `views` WHERE id = 1"
    adminConnection.query(query1, async (error, results) => {
      if (error) {
        console.log("Error adding to views.")
      }
      var currentViews = results[0].totalViews;
      var newViews = currentViews + 1;
      var query2 = "UPDATE `views` SET `totalViews` = ? WHERE `views`.`id` = 1;"
      adminConnection.query(query2, [newViews], async (error, results) => {
        if (error) {
          console.log("Error adding to views.")
        }
        else {
          // Enter code if there is no error. I am leaving this blank for the moment.
        }
      })
    })
  }

  const authenticationPost = require('./authenticationPost');
  app.post('/register', authenticationPost.registerPost);
  app.post('/login', authenticationPost.loginPost);
  app.post('/verify', authenticationPost.verifyPost);

  const authenticationGet = require('./authenticationGet');
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

  const clubs = require('./clubsRoute');
  app.get('/clubs', async (req, res) => {
    await updateViews();
    clubs.viewClubsGet(req, res)
  });

  const homeRoute = require('./homeRoute');
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

  const adminUpdates = require('./adminUpdates');
  // app.post('/updatefeaturetitleanddesc', checkForAdmin, adminUpdates.updatefeaturetitleanddesc);
  app.post('/updatefeaturetitleanddesc', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatefeaturetitleanddesc(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })

  // app.post('/updatecoursestitleanddesc', checkForAdmin, adminUpdates.updatecoursestitleanddesc);
  app.post('/updatecoursestitleanddesc', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatecoursestitleanddesc(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })

  // app.post('/updatemaintitleanddesc', checkForAdmin, adminUpdates.updatemaintitleanddesc);
  app.post('/updatemaintitleanddesc', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatemaintitleanddesc(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })

  // app.post('/updatemainbuttontext', checkForAdmin, adminUpdates.updatemainbuttontext);
  app.post('/updatemainbuttontext', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatemainbuttontext(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })

  // app.post('/updatefeaturedata', checkForAdmin, adminUpdates.updatefeaturedata);
  app.post('/updatefeaturedata', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.updatefeaturedata(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })

  // app.post('/updatecoursesdata', checkForAdmin, adminUpdates.updatecoursesdata);
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

  // app.post('/verifyClub', checkForAdmin, adminUpdates.verifyClub);
  app.post('/verifyClub', (req, res) => {
    var isAuthorized = checkForAdmin(req, res);
    if (isAuthorized === 'Authorized') {
      adminUpdates.verifyClub(req, res)
    }
    else {
      res.send('You are not authorized to do this action. Try signing in again if you think you should be.')
    }
  })


  const clubManagment = require('./clubManagment');
  app.post('/apply', clubManagment.createClubPost);
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
  app.post('/updateBasicInfo', clubManagment.updateInfoPost);
  app.post('/grantClubAccess', clubManagment.addOwnerEmail);
  app.post('/removeClubAccess', clubManagment.removeOwnerEmail);

  const contact = require('./contact');
  app.post('/contact', contact.contactPost)

  const admin = require('./adminRoutes');
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



  connection.on('error', (err) => {
    console.error('MySQL connection error:', err);
    connection.connect((connectErr) => {
      if (connectErr) {
        console.error('MySQL reconnection error:', connectErr);
      } else {
        console.log('Reconnected to MySQL server');
      }
    });
    adminConnection.connect((connectErr) => {
      if (connectErr) {
        console.error('MySQL reconnection error:', connectErr);
      } else {
        console.log('Reconnected to MySQL server');
      }
    });
  });


  app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  });



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
  app.use(async (req, res) => {
    await updateViews()
    res.status(404).render('404.ejs');
  });
}
else {
  console.log("Error Starting Application. isPublic incorrectly defined. Correct values: true; false || Boolean... not a string.")
}

const port = 80;
// const port = 80;
app.listen(port)
console.log(`Listening on port: ${port}`)