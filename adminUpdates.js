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
// LOAD BCRYPT
const bcrypt = require('bcrypt')


// LOAD EXPRESS AND DEFINE EXPRESS MODULES
const express = require('express')
const session = require('express-session')
const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// LOAD MYSQL MODULES AND CONNECT TO DB
const mysql = require('mysql')
const adminconnection = mysql.createConnection({
  host: process.env.adminHost,
  user: process.env.adminUser,
  password: process.env.adminPassword,
  database: process.env.adminDatabase,
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

// COMMENT OUT HERE
const updatefeaturetitleanddesc = (req, res) => {
  const { featureTitle, featureDesc } = req.body;

  let sql = "UPDATE `titles` SET `valueOfTitle` = ? WHERE `titles`.`id` = 1;"
  let sql2 = "UPDATE `titles` SET `valueOfTitle` = ? WHERE `titles`.`id` = 2;"
  adminconnection.query(sql, [featureTitle], (error, result) => {
    if (error) {
      res.send("Unknown error updating data, contact Cole.")
      console.log(error)
    } else {
      adminconnection.query(sql2, [featureDesc], (error, result) => {
        if (error) {
          res.send("Unknown error updating data, contact Cole.")
          console.log(error)
        }
        else { res.redirect(process.env.ADMIN_UPDATE_PAGE) }
      })
    }
  })
}
const updatecoursestitleanddesc = (req, res) => {
  const { coursesTitle, coursesDesc } = req.body;

  let sql = "UPDATE `titles` SET `valueOfTitle` = ? WHERE `titles`.`id` = 3;"
  let sql2 = "UPDATE `titles` SET `valueOfTitle` = ? WHERE `titles`.`id` = 4;"
  adminconnection.query(sql, [coursesTitle], (error, result) => {
    if (error) {
      res.send("Unknown error updating data, contact Cole.")
      console.log(error)
    } else {
      adminconnection.query(sql2, [coursesDesc], (error, result) => {
        if (error) {
          res.send("Unknown error updating data, contact Cole.")
          console.log(error)
        }
        else { res.redirect(process.env.ADMIN_UPDATE_PAGE) }
      })
    }
  })
}
const updatemaintitleanddesc = (req, res) => {
  const { mainTitle, mainDesc } = req.body;

  let sql = "UPDATE `titles` SET `valueOfTitle` = ? WHERE `titles`.`id` = 5;"
  let sql2 = "UPDATE `titles` SET `valueOfTitle` = ? WHERE `titles`.`id` = 6;"
  adminconnection.query(sql, [mainTitle], (error, result) => {
    if (error) {
      res.send("Unknown error updating data, contact Cole.")
      console.log(error)
    } else {
      adminconnection.query(sql2, [mainDesc], (error, result) => {
        if (error) {
          res.send("Unknown error updating data, contact Cole.")
          console.log(error)
        }
        else { res.redirect(process.env.ADMIN_UPDATE_PAGE) }
      })
    }
  })
}
const updatemainbuttontext = (req, res) => {
  const { mainButtonText } = req.body;

  let sql = "UPDATE `titles` SET `valueOfTitle` = ? WHERE `titles`.`id` = 7;"
  adminconnection.query(sql, [mainButtonText], (error, result) => {
    if (error) {
      res.send("Unknown error updating data, contact Cole.")
      console.log(error)
    } else {
      res.redirect(process.env.ADMIN_UPDATE_PAGE)
    }
  })
}
const updatefeaturedata = (req, res) => {
  const { featureID, nameOfFeature, classValue } = req.body;

  let sql = "UPDATE `features` SET `nameOfFeature` = ?, `classValue` = ? WHERE `features`.`id` = ?;"
  adminconnection.query(sql, [nameOfFeature, classValue, featureID], (error, result) => {
    if (error) {
      res.send("Unknown error updating data, contact Cole.")
    }
    else { res.redirect(process.env.ADMIN_UPDATE_PAGE) }
  })
}
const updatecoursesdata = (req, res) => {
  const { courseId, courseTitle, courseDesc } = req.body;

  let sql = "UPDATE `courses` SET `courseTitle` = ?, `courseDesc` = ? WHERE `courses`.`id` = ?;"
  adminconnection.query(sql, [courseTitle, courseDesc, courseId], (error, result) => {
    if (error) {
      res.send("Unknown error updating data, contact Cole.")
    }
    else { res.redirect(process.env.ADMIN_UPDATE_PAGE) }
  })
}
const verifyClub = (req, res) => {
  const { clubId } = req.body;
  if (clubId === null || clubId === undefined || clubId === "") {
    res.redirect('admin')
  }
  else {
    let sql = "SELECT * FROM unverifiedclubs WHERE `unverifiedclubs`.`id` = ?;"
    adminconnection.query(sql, [clubId], (error, result) => {
      if (error) {
        res.send("Unknown error updating data, contact Cole.")
        console.log(error)
        return
      }
      const data = result[0]
      const verifySQL = "INSERT INTO `clubs` (`id`, `clubName`, `clubOwnerName`, `clubDescription`, `ownerEmail`) VALUES (NULL, ?, ?, ?, ?);"
      adminconnection.query(verifySQL, [data.clubName, data.clubOwnerName, data.clubDescription, data.ownerEmail], async (error, results) => {
        if (error) {
          res.send("Unknown error updating data, contact Cole.");
          console.log(error)
          return
        }
        const removeOldSQL = "DELETE FROM unverifiedclubs WHERE id = ?;"
        adminconnection.query(removeOldSQL, [clubId], async (error, results) => {
          if (error) {
            res.send("Unknown error updating data, contact Cole.")
            console.log(error)
            return
          }
          const contents = `
        <h1>Hello ${data.clubOwnerName}</h1>
        <h3>Your club, ${data.clubName} has been accepted.</h3>

        <br><br>
        <h4>Other information:</h4>
        <h4>Club description: ${data.clubDescription}</h4>
        <h4>Owner email: ${data.ownerEmail}</h4>
        `
          const info = await transporter.sendMail({
            from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
            to: data.ownerEmail,
            subject: "Club Accepted",
            html: contents,
          });
          res.redirect('admin')
        })
      })
    })
  }
}

const markContactResolved = async (req, res) => {
  const { questionID } = req.body;
  if (questionID === null || questionID === undefined || questionID === "") {
    res.redirect('admin')
  }
  else {
    const markResolvedQuery = "UPDATE `contactrequests` SET `isFulfilled` = 'y' WHERE `contactrequests`.`requestID` = ?;"
    adminconnection.query(markResolvedQuery, [questionID], async (error, results) => {
      if (error) {
        res.send('There was an error, please contact Cole.')
      }
      res.redirect('admin')
    })
  }
}


// LOCKDOWN ADMIN (TO USE: COMMENT OUT THE CODE ABOVE AND UNCOMMENT THE CODE BELOW)

// const currentIssue = 'Dev functions can be exploited to work without proper cridentials.'
// const textResponse = `We are sorry, but admin features are disabled at the moment for all admins. The dev time are aware of this, and are working to fix the reason this is happening. Please hang tight while we work on this issue. <br>Current Issue: ${currentIssue}`

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