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
const { renderView, updateViews, getTitleFromFile, getDescFromFile } = require('./pageRenderer')
const { usersModel } = require('./database')
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
  // DEPRACATED SOON WHEN VIDEO BECOMES AVALIABLE
  function shouldRenderPage(fileName, req, res) {
    var hasAcceptedCookies = req.session.acceptedCookies;
    if (hasAcceptedCookies === true) {
      return 'Continue'
    }
    else {
      var title = getTitleFromFile(fileName)
      var description = getDescFromFile(fileName)
      res.render('acceptCookies', { title, description })
    }
  }
  async function RenderPage(fileName, req, res, pageFunction) {
    var hasAcceptedCookies = req.session.acceptedCookies;
    if (hasAcceptedCookies === true) {
      var title = getTitleFromFile(fileName)
      var description = getDescFromFile(fileName)
      if (req.session.email != undefined) {
        var query = { email: req.session.email }
        var data = await usersModel.find(query)
        console.log(data)
        const accountInfo = {
          isVerified: data[0].isVerified,
          email: data[0].email,
          fullName: data[0].name,
          country: data[0].country,
          city: data[0].city,
          state: data[0].state,
          id: data[0]._id
        }
        pageFunction(req, res, accountInfo, title, description)

      }
      else {
        const accountInfo = {
          isLoggedIn: "no"
        }
        pageFunction(req, res, accountInfo, title, description)
      }

    }
    else {
      var title = getTitleFromFile(fileName)
      var description = getDescFromFile(fileName)
      const accountInfo = {
        isLoggedIn: "no"
      }
      res.render('acceptCookies', { title, description, accountInfo })
    }
  }
  async function postReq(req, res, pageFunction) {
    var hasAcceptedCookies = req.session.acceptedCookies;
    if (hasAcceptedCookies === true) {
      pageFunction(req, res)
    }
    else {
      res.send('You have not accepted cookies. Cannot follow up on post request.')
    }
  }
  async function postReqAdmin(req, res, pageFunction) {
    var hasAcceptedCookies = req.session.acceptedCookies;
    if (hasAcceptedCookies === true) {
      var isAdmin = checkForAdmin(req, res);
      if (isAdmin === 'Authorized') {
        var query = { email: req.session.email }
        var data = await usersModel.find(query)
        const accountInfo = {
          isVerified: data[0].isVerified,
          email: data[0].email,
          fullName: data[0].name,
          country: data[0].country,
          city: data[0].city,
          state: data[0].state,
          id: data[0]._id
        }
        console.log(accountInfo)
        pageFunction(req, res, accountInfo)
      }
      else {
        res.send('You are not authorized to do this action. Please sign in again if you think you should be.')
      }
    }
    else {
      var title = getTitleFromFile(fileName)
      var description = getDescFromFile(fileName)
      res.render('acceptCookies', { title, description })
    }
  }
  async function RenderPageAdmin(fileName, req, res, pageFunction) {
    var hasAcceptedCookies = req.session.acceptedCookies;
    if (hasAcceptedCookies === true) {
      var isAdmin = checkForAdmin(req, res);
      if (isAdmin === 'Authorized') {
        if (pageFunction) {
          var query = { email: req.session.email }
          var data = await usersModel.find(query)
          const accountInfo = {
            isVerified: data[0].isVerified,
            email: data[0].email,
            fullName: data[0].name,
            country: data[0].country,
            city: data[0].city,
            state: data[0].state,
            id: data[0]._id
          }
          console.log(accountInfo)
          pageFunction(req, res, accountInfo)
        }
        else {
          var query = { email: req.session.email }
          var data = await usersModel.find(query)
          const accountInfo = {
            isVerified: data[0].isVerified,
            email: data[0].email,
            fullName: data[0].name,
            country: data[0].country,
            city: data[0].city,
            state: data[0].state,
            id: data[0]._id
          }
          console.log(accountInfo)
          renderView(fileName, req, res, accountInfo)
        }
      }
      else {
        var fileName = "404"
        renderView(fileName, req, res)
      }
    }
    else {
      var title = getTitleFromFile(fileName)
      var description = getDescFromFile(fileName)
      res.render('acceptCookies', { title, description })
    }
  }
  async function RenderPagePlain(fileName, req, res) {
    var hasAcceptedCookies = req.session.acceptedCookies;
    if (hasAcceptedCookies === true) {
      var query = { email: req.session.email }
      var data = await usersModel.find(query)
      let accountInfo;
      if (data.length > 0) {
        accountInfo = {
          isVerified: data[0].isVerified,
          email: data[0].email,
          fullName: data[0].name,
          country: data[0].country,
          city: data[0].city,
          state: data[0].state,
          id: data[0]._id
        }
      }
      else {
        accountInfo = {
          isLoggedIn: "no"
        }
      }
      renderView(fileName, req, res, accountInfo)
    }
    else {
      var title = getTitleFromFile(fileName)
      var description = getDescFromFile(fileName)
      res.render('acceptCookies', { title, description })
    }
  }

  // POST REQUESTS
  app.post('/register', (req, res) => {
    var pageFunction = authenticationPost.registerPost
    postReq(req, res, pageFunction)
  })
  app.post('/login', (req, res) => {
    var pageFunction = authenticationPost.loginPost
    postReq(req, res, pageFunction)
  })
  app.post('/verify', (req, res) => {
    var pageFunction = authenticationPost.verifyPost
    postReq(req, res, pageFunction)
  })
  app.post('/forgotpasswordpost', (req, res) => {
    var pageFunction = authenticationPost.forgotPasswordPost
    postReq(req, res, pageFunction)
  })
  app.post('/updatefeaturetitleanddesc', (req, res) => {
    var pageFunction = adminUpdates.updatefeaturetitleanddesc;
    postReqAdmin(req, res, pageFunction)
  })
  app.post('/updatecoursestitleanddesc', (req, res) => {
    var pageFunction = adminUpdates.updatecoursestitleanddesc
    postReqAdmin(req, res, pageFunction)
  })
  app.post('/updatemaintitleanddesc', (req, res) => {
    var pageFunction = adminUpdates.updatemaintitleanddesc
    postReqAdmin(req, res, pageFunction)
  })
  app.post('/updatemainbuttontext', (req, res) => {
    var pageFunction = adminUpdates.updatemainbuttontext
    postReqAdmin(req, res, pageFunction)
  })
  app.post('/updatefeaturedata', (req, res) => {
    var pageFunction = adminUpdates.updatefeaturedata
    postReqAdmin(req, res, pageFunction)
  })
  app.post('/updatecoursesdata', (req, res) => {
    var pageFunction = adminUpdates.updatecoursesdata
    postReqAdmin(req, res, pageFunction)
  })
  app.post('/fulfillQuestion', (req, res) => {
    var pageFunction = adminUpdates.markContactResolved
    postReqAdmin(req, res, pageFunction)
  })
  app.post('/verifyClub', (req, res) => {
    var pageFunction = adminUpdates.verifyClub
    postReqAdmin(req, res, pageFunction)
  })
  app.post('/delete-account', (req, res) => {
    var pageFunction = authenticationPost.deleteAccountPost
    postReq(req, res, pageFunction)
  })
  app.post('/apply', (req, res) => {
    var pageFunction = clubManagment.createClubPost;
    postReq(req, res, pageFunction)
  })
  app.post('/updateBasicInfo', (req, res) => {
    var pageFunction = clubManagment.updateInfoPost;
    postReq(req, res, pageFunction)
  })
  app.post('/contact', (req, res) => {
    var pageFunction = contact.contactPost;
    postReq(req, res, pageFunction)
  })
  app.post('/agree-to-cookies', (req, res) => {
    req.session.acceptedCookies = true;
    res.redirect('/')
  })

  // GET REQUESTS
  app.get('/register', async (req, res) => {
    var fileName = "register";
    var pageFunction = authenticationGet.registerGet;
    RenderPage(fileName, req, res, pageFunction)
  });
  app.get('/login', async (req, res) => {
    var fileName = "login";
    var pageFunction = authenticationGet.loginGet
    RenderPage(fileName, req, res, pageFunction)
  });
  app.get('/verify', async (req, res) => {
    var fileName = "verify";
    var pageFunction = authenticationGet.verifyGet
    RenderPage(fileName, req, res, pageFunction)
  });
  app.get('/clubs', async (req, res) => {
    var fileName = "clubs";
    var pageFunction = clubs.viewClubsGet
    RenderPage(fileName, req, res, pageFunction)
  });
  app.get('/', async (req, res) => {
    var fileName = "index";
    var pageFunction = homeRoute.homeRoute
    RenderPage(fileName, req, res, pageFunction)
  });
  // TEMPORARY CODE WILL BE CHANGED TO REUSABLE CODE ONCE VIDEO RELEASED
  app.get('/introductory-video', async (req, res) => {
    var fileName = "introductory-video";
    var shouldContinue = await shouldRenderPage(fileName, req, res)
    if (shouldContinue === "Continue") {
      var isAdmin = checkForAdmin(req, res);
      if (isAdmin === 'Authorized') {
        RenderPagePlain("introductory-video", req, res)
      }
      else {
        RenderPagePlain('introductory-video-not-released', req, res)
      }
    }
  })
  app.get('/apply', async (req, res) => {
    var fileName = "applyForClub";
    var pageFunction = clubManagment.clubApplyGet
    RenderPage(fileName, req, res, pageFunction)
  });
  app.get('/club-created', async (req, res) => {
    var fileName = "beingReviewed";
    var pageFunction = clubManagment.clubCreatedGet
    RenderPage(fileName, req, res, pageFunction)
  });
  app.get('/manage-club', async (req, res) => {
    var fileName = "manageClub";
    var pageFunction = clubManagment.clubManageGet
    RenderPage(fileName, req, res, pageFunction)
  });
  app.get('/admin', async (req, res) => {
    var fileName = "admin";
    var pageFunction = admin.admin
    RenderPageAdmin(fileName, req, res, pageFunction)
  })
  app.get('/contact', async (req, res) => {
    var fileName = "contact";
    RenderPagePlain(fileName, req, res)
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
  app.use(async (req, res) => {
    res.status(404).render('404.ejs');
  });
}
else if (isPublic === false) {
  app.get('/', async (req, res) => {
    await RenderPagePlain("siteNotPublic", req, res)
  });
  app.get('/css/allFrontend.css', (req, res) => {
    res.sendFile('C:\\Users\\colew\\OneDrive\\Documents\\server\\views\\allFrontend.css');
  })
  app.use(async (req, res) => {
    res.redirect('/')
  });
}
else {
  console.log("Error Starting Application. isPublic incorrectly defined. Correct values: true; false || Boolean... not a string.")
}

const port = 80;
// const port = 80;
app.listen(port)
console.log(`Listening on port: ${port}`)