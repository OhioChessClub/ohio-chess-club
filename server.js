// FALSE: WEBSITE IN "LOCKDOWN" COULD BE USED FOR BIG ISSUES
// TRUE: WESITE FUNCTIONS LIKE NORMAL
var isPublic = true;

// FALSE: WEBSITE IS STILL IN MAJOR DEVELOPMENT AND NOT RELEASED TO THE PUBLIC YET. BOTH HAVE DIFFERENT MEANINGS.
// TRUE: WESITE FUNCTIONS LIKE NORMAL
var siteReleased = true;

// REQUIRE STATMENTS AND IMPORTS
require('dotenv').config()
const rateLimit = require('express-rate-limit')
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
const introductoryVideo = require('./introductory-video')
const { renderView, updateViews, getTitleFromFile, getDescFromFile } = require('./pageRenderer')
const { usersModel } = require('./database')
const { checkForAdmin } = require('./checkForAdmin');
// DECLARE NESSESARY VARIABLES AND CONFIG EXPRESS AS NEEDED

const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 80,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: "Too many requests from this IP detected. Try again in 15 minutes."
})
const getLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: "Too many requests from this IP detected. Try again in 15 minutes."
})
app.use(session({
  secret: 'WEqwewqewq4F5WEQWEFQW',
  resave: false,
  saveUninitialized: false,
  name: 'session',
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

// FUNCTIONS
(async () => {
  const isConnected = await databaseHelper.connect();
  if (isConnected === "Connected") {
    console.log("Server file has confirmed that database has connected.");
  }
})()

async function getAccountInformation(req) {
  if (req.session.email != undefined) {
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
    return accountInfo
  }
  else {
    return accountInfo = {
      isLoggedIn: "no"
    }
  }

}

async function postReq(req, res, pageFunction, fileName) {
  await postLimiter(req, res, async () => {
    const canonicalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    var title = getTitleFromFile(fileName)
    var description = getDescFromFile(fileName)
    var hasAcceptedCookies = req.session.acceptedCookies;
    if (hasAcceptedCookies === true) {
      const accountInfo = await getAccountInformation(req)
      pageFunction(req, res, title, description, accountInfo, canonicalUrl)
    }
    else {
      res.send('You have not accepted cookies. Cannot follow up on post request.')
    }
  })



}
async function postReqAdmin(req, res, pageFunction, fileName) {
  await postLimiter(req, res, async () => {
    const canonicalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    var title = getTitleFromFile(fileName)
    var description = getDescFromFile(fileName)
    var hasAcceptedCookies = req.session.acceptedCookies;
    if (hasAcceptedCookies === true) {
      var isAdmin = checkForAdmin(req, res);
      if (isAdmin === 'Authorized') {
        const accountInfo = await getAccountInformation(req)
        pageFunction(req, res, title, description, accountInfo, canonicalUrl)
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
  })

}

async function RenderPage(fileName, req, res, pageFunction) {
  await getLimiter(req, res, async () => {
    await updateViews();
    const canonicalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    var hasAcceptedCookies = req.session.acceptedCookies;
    var title = getTitleFromFile(fileName)
    var description = getDescFromFile(fileName)
    const accountInfo = await getAccountInformation(req)
    if (siteReleased) {
      if (hasAcceptedCookies === true) {
        pageFunction(req, res, accountInfo, title, description, canonicalUrl)
      }
      else {
        res.render('acceptCookies', { title, description, accountInfo, canonicalUrl })
      }
    }
    else {
      res.render('unreleased', { title, description, accountInfo, canonicalUrl })
    }
  })

}
async function RenderPageAdmin(fileName, req, res, pageFunction) {
  await getLimiter(req, res, async () => {
    const canonicalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    var hasAcceptedCookies = req.session.acceptedCookies;
    var title = getTitleFromFile(fileName)
    var description = getDescFromFile(fileName)
    const accountInfo = await getAccountInformation(req)
    if (siteReleased) {
      if (hasAcceptedCookies === true) {
        var isAdmin = checkForAdmin(req);
        if (isAdmin == 'Authorized') {
          const accountInfo = await getAccountInformation(req);
          pageFunction(req, res, accountInfo, title, description, canonicalUrl)
        }
        else {
          var fileName = "404"
          renderView(fileName, req, res)
        }
      }
      else {
        res.render('acceptCookies', { title, description, accountInfo, canonicalUrl })
      }
    }
    else {
      res.render('unreleased', { title, description, accountInfo, canonicalUrl })
    }
  })

}


if (isPublic == true) {
  // POST REQUESTS
  app.post('/register', (req, res) => {
    var fileName = "register"
    var pageFunction = authenticationPost.registerPost
    postReq(req, res, pageFunction, fileName)
  })
  app.post('/login', (req, res) => {
    var fileName = "login"
    var pageFunction = authenticationPost.loginPost
    postReq(req, res, pageFunction, fileName)
  })
  app.post('/verify', (req, res) => {
    var fileName = "verify"
    var pageFunction = authenticationPost.verifyPost
    postReq(req, res, pageFunction, fileName)
  })
  app.post('/forgotpasswordpost', (req, res) => {
    var fileName = "forgotPassword"
    var pageFunction = authenticationPost.forgotPasswordPost
    postReq(req, res, pageFunction, fileName)
  })
  app.post('/logout-account', (req, res) => {
    var fileName = "login"
    var pageFunction = authenticationPost.logoutPost
    postReq(req, res, pageFunction, fileName)
  })
  app.post('/updatefeaturetitleanddesc', (req, res) => {
    var fileName = "admin"
    var pageFunction = adminUpdates.updatefeaturetitleanddesc;
    postReqAdmin(req, res, pageFunction, fileName)
  })
  app.post('/updatecoursestitleanddesc', (req, res) => {
    var fileName = "admin"
    var pageFunction = adminUpdates.updatecoursestitleanddesc
    postReqAdmin(req, res, pageFunction, fileName)
  })
  app.post('/updatemaintitleanddesc', (req, res) => {
    var fileName = "admin"
    var pageFunction = adminUpdates.updatemaintitleanddesc
    postReqAdmin(req, res, pageFunction, fileName)
  })
  app.post('/updatemainbuttontext', (req, res) => {
    var fileName = "admin"
    var pageFunction = adminUpdates.updatemainbuttontext
    postReqAdmin(req, res, pageFunction, fileName)
  })
  app.post('/updatefeaturedata', (req, res) => {
    var fileName = "admin"
    var pageFunction = adminUpdates.updatefeaturedata
    postReqAdmin(req, res, pageFunction, fileName)
  })
  app.post('/updatecoursesdata', (req, res) => {
    var fileName = "admin"
    var pageFunction = adminUpdates.updatecoursesdata
    postReqAdmin(req, res, pageFunction, fileName)
  })
  app.post('/forgotpasswordlinkpost', (req, res) => {
    var fileName = "forgotPassword"
    var pageFunction = authenticationPost.forgotPasswordLinkPost
    postReq(req, res, pageFunction, fileName)
  })
  app.post('/fulfillQuestion', (req, res) => {
    var fileName = "admin"
    var pageFunction = adminUpdates.markContactResolved
    postReqAdmin(req, res, pageFunction, fileName)
  })
  app.post('/verifyClub', (req, res) => {
    var fileName = "admin"
    var pageFunction = adminUpdates.verifyClub
    postReqAdmin(req, res, pageFunction, fileName)
  })
  app.post('/delete-account', (req, res) => {
    var fileName = "login"
    var pageFunction = authenticationPost.deleteAccountPost
    postReq(req, res, pageFunction, fileName)
  })
  app.post('/apply', (req, res) => {
    var fileName = "applyForClub"
    var pageFunction = clubManagment.createClubPost;
    postReq(req, res, pageFunction, fileName)
  })
  app.post('/updateBasicInfo', (req, res) => {
    var fileName = "manageClub"
    var pageFunction = clubManagment.updateInfoPost;
    postReq(req, res, pageFunction, fileName)
  })
  app.post('/contact', (req, res) => {
    var fileName = "contact"
    var pageFunction = contact.contactPost;
    postReq(req, res, pageFunction, fileName)
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
  app.get('/forgot-password', (req, res) => {
    var fileName = "forgotPassword";
    var pageFunction = authenticationGet.forgotPasswordGet;
    RenderPage(fileName, req, res, pageFunction)
  })
  app.get('/reset-password-link', (req, res) => {
    var fileName = "forgotPasswordLink";
    var pageFunction = authenticationGet.forgotPasswordLinkGet;
    RenderPage(fileName, req, res, pageFunction)
  })
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
  app.get('/introductory-video', async (req, res) => {
    var fileName = "introductory-video";
    var pageFunction = introductoryVideo.introductoryVideoRoute
    RenderPage(fileName, req, res, pageFunction)
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
    var pageFunction = contact.contactGet
    RenderPage(fileName, req, res, pageFunction)
  })
  app.get('/sitemap.xml', (req, res) => {
    res.sendFile('C:\\Users\\colew\\OneDrive\\Documents\\server\\sitemap.xml')
  })
  app.get('/sitemap2.xml', (req, res) => {
    res.sendFile('C:\\Users\\colew\\OneDrive\\Documents\\server\\sitemap2.xml')
  })
  app.use(async (req, res) => {
    res.status(404).render('404.ejs');
  });
}
else if (isPublic == false) {
  app.get('/', async (req, res) => {
    var fileName = "siteNotPublic";
    var pageFunction = homeRoute.siteNotPublicRoute
    RenderPage(fileName, req, res, pageFunction)
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
app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
