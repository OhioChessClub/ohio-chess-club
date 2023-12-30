const {
  contactrequestsModel
} = require('./database')

const { transporter } = require('./nodeMailer')

const contactPost = async (req, res, accountInfo, title, description, canonicalUrl) => {
  try {
    var formEnabled = true;
    if (formEnabled === true) {



      const { contactName, contactEmail, contactText } = req.body;
      const isFulfilled = 'n';


      const contents = `
<div class="container">
  <div class="content">
    <h1>Thanks for reaching out to us!</h1>
    <p>${contactName},</p>
    <p>Thank you for contacting the Ohio Chess Club.</p>
    <p>We have recieved your question and you will be reached out to within 24 hours at this email address.</p>
  </div>
  <div class="footer">
    <p>This email was sent to you by the <b>Ohio Chess Club</b>.</p>
    <p>Please do not reply to this email.</p>
  </div>
</div>
  `

      await transporter.sendMail({
        from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
        to: contactEmail,
        subject: "Your Question has Been Recieved",
        html: contents,
      });

      await importIntoDatabase(contactName, contactEmail, contactText, isFulfilled, req, res, title, description, accountInfo, canonicalUrl);

      var actionFinished = `Your request has been processed. You should be reached out to by email within 24 hours. A confirmation email has been sent to your email. (${contactEmail})`
      res.render('contact', { actionFinished, accountInfo, title, description, accountInfo, canonicalUrl });
    }
    else {
      var error = "The contact form is not avaliable to the public at this time."
      res.render('contact', { actionError: error, accountInfo, title, description, accountInfo, canonicalUrl })

    }

  }
  catch (error) {
    sendError(req, res, error, accountInfo)
  }
}

function sendError(req, res, error, title, description, accountInfo, canonicalUrl) {
  console.log(`CONTACT ERROR: ` + error)
  var actionError = `There was an error sending your request. Our developers have been notified and are looking into it. We are sorry for the inconvienience.`;
  res.render('contact', { actionError, accountInfo, title, description, accountInfo, canonicalUrl })
}

const contactGet = async (req, res, accountInfo, title, description, canonicalUrl) => {
  res.render('contact', { title, description, accountInfo, canonicalUrl })
}

function importIntoDatabase(contactName, contactEmail, contactText, isFulfilled, req, res) {
  try {
    var contact = new contactrequestsModel({
      email: contactEmail,
      name: contactName,
      question: contactText,
      isFulfilled: isFulfilled
    })
    contact.save()
  }
  catch (error) {
    if (error) {
      sendError(req, res, error)
      return;
    }
  }
}



module.exports = {
  contactPost,
  contactGet
};


