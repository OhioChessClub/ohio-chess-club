const {
  usersModel
} = require('./database')
const loginGet = async (req, res, accountInfo, title, description, canonicalUrl) => {
  if (req.session.accountPresent) {
    if (req.session.accountVerified === false) {
      res.redirect('/verify')
    }
    else {
      res.redirect('/')
    }
  }
  else if (!req.session.loggedIn) {
    if (req.session.forgotPasswordSuccess) {
      var actionSuccess = req.session.forgotPasswordSuccess;
      req.session.forgotPasswordSuccess = null;
      res.render('login', { accountInfo, title, description, actionSuccess, canonicalUrl })
    }
    else {
      res.render('login', { accountInfo, title, description, canonicalUrl })
    }

  }
  else { res.redirect('/') }
};
const registerGet = async (req, res, accountInfo, title, description, canonicalUrl) => {
  if (req.session.accountPresent) {
    if (req.session.accountVerified === false) {
      res.redirect('/verify')
    }
  }
  else if (!req.session.loggedIn) {
    res.render('register', { accountInfo, title, description, canonicalUrl })
  }
  else { res.redirect('/') }

};
const verifyGet = async (req, res, accountInfo, title, description, canonicalUrl) => {
  try {
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
        const query = { email: email }
        var results = await usersModel.findOne(query)
        if (results.length === 0) {
          res.redirect('login');
          return;
        }


        res.render('verify', { email: req.session.email, accountInfo, title, description, canonicalUrl });
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
const forgotPasswordGet = async (req, res, accountInfo, title, description, canonicalUrl) => {
  if (req.session.accountPresent == true) {
    res.redirect('/')
  }
  else {
    if (req.session.forgotPasswordError) {
      var actionError = req.session.forgotPasswordError;
      req.session.forgotPasswordError = null;
      res.render('forgotPassword', { title, description, accountInfo, actionError, canonicalUrl })
    }
    if (req.session.forgotPasswordSuccess) {
      var actionSuccess = req.session.forgotPasswordSuccess;
      req.session.forgotPasswordSuccess = null;
      res.render('forgotPassword', { title, description, accountInfo, actionSuccess, canonicalUrl })
    }
    else {
      res.render('forgotPassword', { title, description, accountInfo, canonicalUrl })
    }

  }
}
const forgotPasswordLinkGet = async (req, res, accountInfo, title, description, canonicalUrl) => {
  if (req.session.accountPresent == true) {
    res.redirect('/')
  }
  else {
    const email = req.query.email;
    const key = req.query.key;
    if (email && key) {
      var filter = { email: email };
      var data = await usersModel.find(filter)
      if (data.length > 0) {
        if (data[0].changePasswordCode === parseInt(key)) {
          res.render('forgotPasswordLink', { title, description, accountInfo, email, key, canonicalUrl })
        }
        else {
          res.render('forgotPasswordUnauthorized', { title, description, accountInfo, canonicalUrl })
        }
      }
      else {
        res.render('forgotPasswordUnauthorized', { title, description, accountInfo, canonicalUrl })
      }

    }
    else {
      res.render('forgotPasswordUnauthorized', { title, description, accountInfo, canonicalUrl })
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

