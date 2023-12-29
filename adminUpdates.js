// LOAD DOTENV
require('dotenv').config();

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
const {
  featuresModel,
  titlesModel,
  coursesModel,
  unverifiedclubsModel,
  contactrequestsModel,
  clubsModel
} = require('./database')
// COMMENT OUT HERE
const updatefeaturetitleanddesc = async (req, res) => {
  try {
    const { featureTitle, featureDesc } = req.body;
    const query1 = { id: 1 };
    const query2 = { id: 2 };
    await titlesModel.findOneAndUpdate(query1, { valueOfTitle: featureTitle })
    await titlesModel.findOneAndUpdate(query2, { valueOfTitle: featureDesc })
    res.redirect(process.env.ADMIN_UPDATE_PAGE)
  }
  catch (error) {
    res.send('There was an error updating the feature title and description. Please send a contact request to let us know. ERROR: ' + error)
    console.log("ERROR WITH ADMIN FUNCTION UPDATE FEATURE TITLE DESC: " + error)
  }
}
const updatecoursestitleanddesc = async (req, res) => {
  try {
    const { coursesTitle, coursesDesc } = req.body;
    const query1 = { id: 3 };
    const query2 = { id: 4 };
    await titlesModel.findOneAndUpdate(query1, { valueOfTitle: coursesTitle })
    await titlesModel.findOneAndUpdate(query2, { valueOfTitle: coursesDesc })
    res.redirect(process.env.ADMIN_UPDATE_PAGE)
  }
  catch (error) {
    res.send('There was an error updating the courses title and description. Please send a contact request to let us know. ERROR: ' + error)
    console.log("ERROR WITH ADMIN FUNCTION UPDATE COURSES TITLE DESC: " + error)
  }

}
const updatemaintitleanddesc = async (req, res) => {
  try {
    const { mainTitle, mainDesc } = req.body;
    const query1 = { id: 5 };
    const query2 = { id: 6 };
    await titlesModel.findOneAndUpdate(query1, { valueOfTitle: mainTitle })
    await titlesModel.findOneAndUpdate(query2, { valueOfTitle: mainDesc })
    res.redirect(process.env.ADMIN_UPDATE_PAGE)
  }
  catch (error) {
    res.send('There was an error updating the main title and description. Please send a contact request to let us know. ERROR: ' + error)
    console.log("ERROR WITH ADMIN FUNCTION UPDATE MAIN TITLE DESC: " + error)
  }

}
const updatemainbuttontext = async (req, res) => {
  try {
    const { mainButtonText } = req.body;
    const query = { id: 7 }
    await titlesModel.findOneAndUpdate(query, { valueOfTitle: mainButtonText })
    res.redirect(process.env.ADMIN_UPDATE_PAGE)
  }
  catch (error) {
    res.send('There was an error updating the main button text. Please send a contact request to let us know. ERROR: ' + error)
    console.log("ERROR WITH ADMIN FUNCTION UPDATE MAIN BTN TEXT: " + error)
  }

}
const updatefeaturedata = async (req, res) => {
  try {
    const { featureID, nameOfFeature, classValue } = req.body;
    const query = { id: featureID };
    await featuresModel.findOneAndUpdate(query, { nameOfFeature: nameOfFeature, classValue: classValue })
    res.redirect(process.env.ADMIN_UPDATE_PAGE)
  }
  catch (error) {
    res.send('There was an error updating the feature. Please send a contact request to let us know. ERROR: ' + error)
    console.log("ERROR WITH ADMIN FUNCTION UPDATE FEATURE: " + error)
  }
}
const updatecoursesdata = async (req, res) => {
  try {
    const { courseId, courseTitle, courseDesc } = req.body;
    const query = { id: courseId }
    await coursesModel.findOneAndUpdate(query, { courseTitle: courseTitle, courseDesc: courseDesc })
    res.redirect(process.env.ADMIN_UPDATE_PAGE)
  }
  catch (error) {
    res.send('There was an error updating the course. Please send a contact request to let us know. ERROR: ' + error)
    console.log("ERROR WITH ADMIN FUNCTION UPDATE COURSE: " + error)
  }

}
const verifyClub = async (req, res) => {
  const { clubId } = req.body;
  if (clubId === null || clubId === undefined || clubId === "") {
    res.redirect(process.env.ADMIN_UPDATE_PAGE)
  }
  else {
    try {
      const unverifiedclubsQuery = { _id: clubId };
      var data = await unverifiedclubsModel.findOne(unverifiedclubsQuery)
      const club = new clubsModel({
        clubName: data.clubName,
        clubOwnerName: data.clubOwnerName,
        clubDescription: data.clubDescription,
        ownerEmail: data.ownerEmail
      })
      await club.save();
      await unverifiedclubsModel.findOneAndDelete(unverifiedclubsQuery)
      const contents = `
    <h1>Hello ${data.clubOwnerName}</h1>
    <h3>Your club, ${data.clubName} has been accepted.</h3>

    <br><br>
    <h4>Other information:</h4>
    <h4>Club description: ${data.clubDescription}</h4>
    <h4>Owner email: ${data.ownerEmail}</h4>
    `
      await transporter.sendMail({
        from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
        to: data.ownerEmail,
        subject: "Club Accepted",
        html: contents,
      });
      res.redirect(process.env.ADMIN_UPDATE_PAGE)
    }
    catch (error) {
      res.send('There was an error verifying the club. Please send a contact request to let us know. ERROR: ' + error)
      console.log("ERROR WITH ADMIN FUNCTION VERIFY CLUB: " + error)
    }
  }
}
const markContactResolved = async (req, res) => {
  const { questionID } = req.body;
  if (questionID === null || questionID === undefined || questionID === "") {
    res.redirect('admin')
  }
  else {
    try {
      const query = {
        _id: questionID
      }
      await contactrequestsModel.findOneAndUpdate(query, { isFulfilled: "y" })
      res.redirect(process.env.ADMIN_UPDATE_PAGE)
    }
    catch (error) {
      res.send('There was an error marking the contact request resolved. Please send a contact request to let us know. ERROR: ' + error)
      console.log("ERROR WITH ADMIN FUNCTION MARK CONTACT RESOLVED: " + error)
    }
  }
}

const currentIssue = 'No current issues detected in this commit.'
const textResponse = `We are sorry, but admin features are disabled at the moment for all admins. The dev time are aware of this, and are working to fix the reason this is happening. Please hang tight while we work on this issue. <br>Current Issue: ${currentIssue}`

// LOCKDOWN ADMIN (TO USE: COMMENT OUT THE CODE ABOVE AND UNCOMMENT THE CODE BELOW)

// const updatefeaturetitleanddesc = async (req, res) => {
//   res.send(`${textResponse}`)
// }
// const updatecoursestitleanddesc = async (req, res) => {
//   res.send(`${textResponse}`)
// }
// const updatemaintitleanddesc = async (req, res) => {
//   res.send(`${textResponse}`)
// }
// const updatemainbuttontext = async (req, res) => {
//   res.send(`${textResponse}`)
// }
// const updatefeaturedata = async (req, res) => {
//   res.send(`${textResponse}`)
// }
// const updatecoursesdata = async (req, res) => {
//   res.send(`${textResponse}`)
// }
// const verifyClub = async (req, res) => {
//   res.send(`${textResponse}`)
// }
// const markContactResolved = async (req, res) => {
//   res.send(`${textResponse}`)
// }


module.exports = {
  updatefeaturetitleanddesc,
  updatecoursestitleanddesc,
  updatemaintitleanddesc,
  updatemainbuttontext,
  updatefeaturedata,
  updatecoursesdata,
  verifyClub,
  markContactResolved
}