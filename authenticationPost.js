const {
  usersModel
} = require('./database')

const { transporter } = require('./nodeMailer')
const bcrypt = require('bcrypt')

const { isValidEmail, generateCode, verifyPasswordValid } = require('./regex')
const { accountNotVerified, logInAccount, logoutAccount, removeReturn } = require('./sessionChanges')
const loginPost = async (req, res, accountInfo, title, description, canonicalUrl) => {
  const { email, password } = req.body;
  if (!isValidEmail(email)) {
    if (email === process.env.adminEmail) {
      // Admin attempting to log in, don't stop it
    }
    else {
      res.render('login', { actionError: "That email is not valid.", accountInfo, title, description, canonicalUrl })
    }
  }
  const query = { email: email };
  var results = await usersModel.find(query)
  try {
    if (results.length === 1) {
      const storedPassword = results[0].password;
      const passwordMatch = await bcrypt.compare(password, storedPassword);
      if (passwordMatch) {
        if (results[0].isVerified === "false" | results[0].isVerified === false) {
          console.log("Unverified")
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
        res.render('login', { actionError: "Incorrect password for that email.", accountInfo, title, description, canonicalUrl })
      }
    } else {
      res.render('login', { actionError: "No user with that email exists.", accountInfo, title, description, canonicalUrl })
    }
  } catch (error) {
    console.error(error);
    res.render('login', { actionError: `Error logging in: ${error}`, accountInfo, title, description, canonicalUrl })
  }
};
const registerPost = async (req, res, accountInfo, title, description, canonicalUrl) => {
  try {
    const { email, password, country, city, state, name } = req.body;
    var nullError = "Please make sure that you have entered your country and city."
    var noPassError = "Please enter a password."
    var noEmailError = "Please enter a valid email."
    var noNameError = "Please enter a name."
    if (password === null || password === undefined || password === "") {
      res.render('register', { actionError: noPassError, accountInfo, title, description, canonicalUrl })
    }
    if (name === null || name === undefined || name === "") {
      res.render('register', { actionError: noNameError, accountInfo, title, description, canonicalUrl })
    }
    if (email === null || email === undefined || email === "" || !isValidEmail(email)) {
      res.render('register', { actionError: noEmailError, accountInfo, title, description, canonicalUrl })
    }
    else if (country && city === null || country && city === undefined || country && city === "") {
      res.render('register', { actionError: nullError, accountInfo, title, description, canonicalUrl })
    }
    else if (city === null || city === undefined || city === "") {
      res.render('register', { actionError: nullError, accountInfo, title, description, canonicalUrl })
    }
    else if (country === null || country === undefined || country === "") {
      res.render('register', { actionError: nullError, accountInfo, title, description, canonicalUrl })
    }
    else {

      if (verifyPasswordValid(password) == true) {

        const query = { email: email };
        var results = await usersModel.find(query)
        if (results.length > 0) {
          res.render('register', { actionError: "A user with that email already exists.", accountInfo, title, description, canonicalUrl })
        } else {
          try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const verificationCode = generateCode();
            var user = new usersModel({
              name: name,
              email: email,
              password: hashedPassword,
              verificationCode: verificationCode,
              isVerified: "false",
              country: country,
              city: city,
              state: state,
              changePasswordCode: 0
            });
            user.save()
            // req.session.loggedIn = true;
            accountNotVerified(req, res, email)
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

            await transporter.sendMail({
              from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
              to: email,
              subject: "Verification Code",
              html: contents,
            });

            res.redirect('/verify');


          }
          catch (error) {
            if (error) {
              console.error(error);
              res.render('register', { actionError: error, accountInfo, title, description, canonicalUrl })
            }
          }
        }

      } else {
        var error = "Your password must contain a uppercase and lowercase letter, special character, and must not be less than 12 characters but not more than 30 characters."
        res.render('register', { actionError: error, accountInfo, title, description, canonicalUrl }) 
      }


    }
  } catch (error) {
    console.error(error);
    res.render('register', { actionError: error, accountInfo, title, description, canonicalUrl })
  }
};


const verifyPost = async (req, res, title, description, accountInfo, canonicalUrl) => {
  try {
    const { enteredCode } = req.body;
    if (enteredCode === null || enteredCode.length > 9 || enteredCode < 100000000) {
      var actionError = "Incorrect number of digits."
      res.render('verify', { actionError: actionError, email: req.session.email, accountInfo, title, description, canonicalUrl })
      return
    }
    else if (req.session.email === null | req.session.email === undefined) {
      res.redirect('login')
      return
    }
    const query = {
      email: req.session.email
    }

    const filter = { email: req.session.email }
    const results = await usersModel.find(filter)
    const code = results[0].verificationCode.toString();

    if (enteredCode === code) {
      await usersModel.findOneAndUpdate(query, { isVerified: 'true' })
      const contents = `
        <div class="container">
          <div class="content">
            <h1>Your email is now verified!</h1>
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
      await transporter.sendMail({
        from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
        to: req.session.email,
        subject: "Email Verified",
        html: contents,
      });
      var email = req.session.email;
      logInAccount(req, res, email)
      res.redirect('/');
    } else {
      res.render('verify', { actionError: "Incorrect code. Try again.", email: req.session.email, accountInfo, title, description, canonicalUrl });
    }
  } catch (error) {
    var email = req.session.email
    res.render('verify', { actionError: "There was an error verifying your account. Please send a contact request to let us know, and we will help you out. Error: " + error, accountInfo, title, description, email, canonicalUrl })
    console.log("ERROR VERIFYING ACCOUNT: " + error)
  }
};
const forgotPasswordPost = async (req, res, title, description, canonicalUrl) => {
  try {
    const { email } = req.body;
    var emailIsValid = isValidEmail(email);
    if (emailIsValid === true || email === process.env.adminEmail) {
      const filter = { email: email }
      var data = await usersModel.find(filter);
      if (data.length > 0) {
        var hostname = req.hostname;
        const verificationCode = generateCode();
        await usersModel.findOneAndUpdate(filter, { changePasswordCode: verificationCode })
        const contents = `
      <div class="container">
        <div class="content">
          <h1>Instructions on Reseting your Password</h1>
          <p>Dear User,</p>
          <p>Thank you for submiting a request to change your password.</p>
          <p>To reset your password, please click <a href="https://${hostname}/reset-password-link?email=${email}&key=${verificationCode}">this link.</a>
          <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>This email was sent to you by the <b>Ohio Chess Club</b>.</p>
          <p>Please do not reply to this email.</p>
        </div>
      </div>
        `
        await transporter.sendMail({
          from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
          to: email,
          subject: "Reset your Password",
          html: contents,
        });

        req.session.forgotPasswordSuccess = "A link to reset your password is in your email."
        res.redirect('/login');

      }
      else {
        req.session.forgotPasswordError = "No account under that email address is registered."
        res.redirect('/forgot-password');
      }

    }
    else {
      req.session.forgotPasswordError = "That email is not a valid email."
      res.redirect('/forgot-password')
    }
  } catch (error) {
    if (error) {
      req.session.forgotPasswordError = "There was an unknown error while reseting your passcode. Our developers have been notified and are looking in to it. If this issue persists, feel free to use the contact form so we can help you directly. Thanks so much!"
      res.redirect('/forgot-password')
    }
  }
}
const forgotPasswordLinkPost = async (req, res, title, description, canonicalUrl) => {
  try {
    const email = req.body.email;
    const key = parseInt(req.body.key);
    if (email && key) {
      var filter = { email: email };
      var data = await usersModel.find(filter)
      if (data.length > 0) {
        if (data[0].changePasswordCode != 0 && data[0].changePasswordCode === key) {
          var password = req.body.password;
          if (password === null || password === undefined || password === "") {
            var noPassError = "Please enter a password."
            res.render('forgotPasswordLink', { title, description, email, key, accountInfo, actionError: noPassError, canonicalUrl })
            return;
          }
          else if(verifyPasswordValid(password) == false){
            var error = "Your password must contain a uppercase and lowercase letter, special character, and must not be less than 12 characters but not more than 30 characters."
            res.render('forgotPasswordLink', { title, description, email, key, accountInfo, actionError: error, canonicalUrl }) 
          }
          else {
          var hashedPassword = await bcrypt.hash(password, 10)
          await usersModel.findOneAndUpdate(filter, { password: hashedPassword })
          await usersModel.findOneAndUpdate(filter, { changePasswordCode: 0 })
          const contents = `
  <div class="container">
    <div class="content">
      <h1>Thanks for using our site!</h1>
      <p>Dear User,</p>
      <p>Thank you for being a member of the Ohio Chess Club.</p>
      <p>Your password has been successfully changed.</p>
      <p>If you have any questions or need assistance, feel free to contact our support team.</p>
    </div>
    <div class="footer">
      <p>This email was sent to you by the <b>Ohio Chess Club</b>.</p>
      <p>Please do not reply to this email.</p>
    </div>
  </div>
    `

          await transporter.sendMail({
            from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
            to: email,
            subject: "Password Changed",
            html: contents,
          });
          req.session.forgotPasswordSuccess = "Successfully changed password.";
          res.redirect('/login')

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
  } catch (error) {
    if (error) {
      req.session.forgotPasswordError = "There was an unknown error while reseting your passcode. Our developers have been notified and are looking in to it. If this issue persists, feel free to use the contact form so we can help you directly. Thanks so much!"
      res.redirect('/login')
    }
  }
}
const deleteAccountPost = async (req, res) => {
  try {
    if (req.session.loggedIn) {
      const query = {
        email: req.session.email
      }
      await usersModel.findOneAndDelete(query);
      await logoutAccount(req)
      res.redirect('/')
    }
    else {
      res.send("Cannot fufill request: You are not logged in.")
    }

  }
  catch (error) {
    res.send('There was a error deleting your account. Error: ' + err)
  }
}
const logoutPost = async (req, res) => {
  try {
    if (req.session.loggedIn) {
      await logoutAccount(req)
      res.redirect('/')
    }
    else {
      res.send("Cannot fufill request: You are not logged in.")
    }

  }
  catch (error) {
    res.send('There was a error logging out. Error: ' + err)
  }
}


module.exports = {
  registerPost,
  loginPost,
  verifyPost,
  forgotPasswordPost,
  deleteAccountPost,
  logoutPost,
  forgotPasswordLinkPost
};


