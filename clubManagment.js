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
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

function removeReturn(req, res) {
  req.session.loginReturnURL = null;
}

// LOAD MYSQL MODULES AND CONNECT TO DB
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.defaultHost,
  user: process.env.defaultUser,
  password: process.env.defaultPassword,
  database: process.env.defaultDatabase
});

const adminconnection = mysql.createConnection({
  host: process.env.adminHost,
  user: process.env.adminUser,
  password: process.env.adminPassword,
  database: process.env.adminDatabase,
});

connection.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('MySQL connection lost');
    // Re-establish the connection
    connection.connect();
  } else {
    throw err;
  }
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



function applyRes(req, res) {
  req.session.loginReturnURL = `/apply`;
}
let isAccessTrue;
function checkAccess(req, res) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM `clubs` WHERE FIND_IN_SET(?, ownerEmail) > 0;";

    connection.query(query, [req.session.email], (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      } else if (results.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

const createClubPost = async (req, res) => {
  var publiclyAvaliable = true;
  
  if(publiclyAvaliable === true){

  await checkUserFile.checkForUser(req, res);

  const { clubName, clubOwnerName, clubDescription } = req.body;
  const ownerEmail = req.session.email;
  if (ownerEmail === null || ownerEmail === undefined) {
    res.redirect('login');
    return;
  }



  const query = "INSERT INTO `unverifiedclubs` (`clubName`, `clubOwnerName`, `clubDescription`, `ownerEmail`) VALUES (?, ?, ?, ?);"
  adminconnection.query(query, [clubName, clubOwnerName, clubDescription, ownerEmail], async (error, results) => {
    if (error) {
      console.log(error)
    }
    res.redirect('club-created')
  })



  const contents = `
    <h1>Hi, ${clubOwnerName}</h1>
    <h2>Your club, ${clubName} is being reviewed.</h2>
    <br><br>
    <h3>Other information:</h3>
    <h4>Club Description: ${clubDescription}</h4>
    <h4>Owner email: ${ownerEmail}</h4>
    `
  const info = await transporter.sendMail({
    from: `Ohio Chess Club <ohiochessclub@gmail.com>`,
    to: ownerEmail,
    subject: "Club is being reviewed",
    html: contents,
  });

} else {
  res.render('applyForClub', {actionError: "Creating clubs is not avaliable to the public at this time."})
}
}

const clubApplyGet = async (req, res) => {
  if (!req.session.loggedIn) {
    await applyRes(req, res);
    await checkUserFile.checkForUser(req, res);

    if (res.headersSent) {
      res.render('login');
    }
  }
  else {
    const query = "SELECT * FROM `unverifiedclubs` WHERE `ownerEmail` = ?;"
    connection.query(query, [req.session.email], async (error, results) => {
      if (error) {
        res.render('applyForClub', { clubActive: "error" })
        return;
      }
      if (results[0] != undefined || results[0] != null) {
        res.redirect('manage-club')
      }
      if (results[0] === undefined || results[0] === null) {
        if (results[0] === undefined || results[0] === null) {
          const query = "SELECT * FROM `clubs` WHERE FIND_IN_SET(?, ownerEmail) > 0;";

          await connection.query(query, [req.session.email], (error, results) => {
            if (error) {
              res.send('Unknown error, contact Cole or support.');
              console.log(error);
            } else if (results.length > 0) {
              res.redirect('/manage-club');
            } else {
              res.render('applyForClub', { clubActive: false });
            }
          });

        }
      }
    })
  }
}

const clubCreatedGet = async (req, res) => {
  if (!req.session.loggedIn) {
    await applyRes(req, res);
    await checkUserFile.checkForUser(req, res);

    if (res.headersSent) {
      res.render('login');
    }
  }
  else {
    const query = "SELECT * FROM `unverifiedclubs` WHERE `ownerEmail` = ?;"
    connection.query(query, [req.session.email], (error, results) => {
      if (error) {
        res.redirect('/')
        console.log("CLUB CREATED ERROR")
      }
      if (results[0] != undefined || results[0] != null) {
        res.render('beingReviewed')
      }
      if (results[0] === undefined || results[0] === null) {
        res.redirect('/')
        console.log("CLUB CREATED ERROR")

      }
    })
  }
};

function removeEmailError(req, res) {
  req.session.errorEmailUsed = false;
}

const clubManageGet = async (req, res) => {
  if (!req.session.loggedIn) {
    // await applyRes(req, res);
    await applyRes(req, res)
    await checkUserFile.checkForUser(req, res);

    if (res.headersSent) {
      res.render('login');
    }
  }
  else {
    const query = "SELECT * FROM `unverifiedclubs` WHERE `ownerEmail` = ?;"
    await connection.query(query, [req.session.email], async (error, results) => {
      if (error) {
        res.redirect('/')
        console.log(error)
      }
      else if (results[0] != undefined || results[0] != null || results[0] === "") {
        res.render('manageClubUnverified')
      }
      else if (results[0] === undefined || results[0] === null || results[0] === "") {
        const query = "SELECT * FROM `clubs` WHERE FIND_IN_SET(?, ownerEmail) > 0";
        const emailList = req.session.email.split(",").map(email => email.trim());

        await connection.query(query, [emailList[0]], async (error, results) => {
          if (error) {
            res.send('Unknown error, contact Cole or support.');
          } else if (results.length > 0) {
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
              emailUsed: emailUsed
            });
          } else {
            res.redirect('/apply');
          }
        });

      }
    })
  }
};

const updateInfoPost = async (req, res) => {
  const { clubName, clubOwnerName, clubDescription } = req.body;
  const ownerEmail = req.session.email;
  if (!req.session.loggedIn) {
    await applyRes(req, res);
    await checkUserFile.checkForUser(req, res);

    if (res.headersSent) {
      res.render('login');
    }
  }
  else {

    const query = "SELECT * FROM `clubs` WHERE FIND_IN_SET(?, ownerEmail) > 0";
    const emailList = req.session.email.split(",").map(email => email.trim());

    await connection.query(query, [emailList[0]], async (error, results) => {
      if (error) {
        res.send('Unknown error, contact Cole or support.');
        console.log(error);
      } else if (results.length > 0) {
        const updateQuery = "UPDATE `clubs` SET `clubName` = ?, `clubOwnerName` = ?, `clubDescription` = ? WHERE ownerEmail LIKE CONCAT('%', ?, '%') LIMIT 1;";
        adminconnection.query(updateQuery, [clubName, clubOwnerName, clubDescription, ownerEmail], (error, results) => {
          if (error) {
            res.send('Unknown error, contact Cole or support.');
            console.log(error);
          } else {

            res.redirect('manage-club')
          }
        });
      }
    });

  }
}

function emailUsedError(req, res) {
  req.session.errorEmailUsed = true;
}

const addOwnerEmail = async (req, res) => {
  await checkUserFile.checkForUser(req, res);

  const { newEmail } = req.body;
  const ownerEmail = req.session.email;
  if (ownerEmail === null || ownerEmail === undefined) {
    res.redirect('login');
    return;
  }

  try {
    const isAccessTrue = await checkAccess(req, res);

    if (isAccessTrue) {
      const checkQuery = "SELECT COUNT(*) AS emailCount FROM `clubs` WHERE ownerEmail LIKE CONCAT('%', ?, '%');";
      adminconnection.query(checkQuery, [newEmail], async (error, results) => {
        if (error) {
          res.send('Unknown error, contact Cole or support.');
          console.log(error);
        } else {
          const emailCount = results[0].emailCount;
          if (emailCount > 0) {
            await emailUsedError(req, res);
            res.redirect('manage-club');
            return;
          } else {
            const selectQuery = "SELECT ownerEmail FROM `clubs` WHERE ownerEmail LIKE CONCAT('%', ?, '%') LIMIT 1;";
            adminconnection.query(selectQuery, [ownerEmail], (error, results) => {
              if (error) {
                res.send('Unknown error, contact Cole or support.');
                console.log(error);
               } else {
                const existingEmails = results[0].ownerEmail.split(',').map(email => email.trim());
                const updatedEmails = existingEmails.concat(newEmail);
                const updatedEmailsStr = updatedEmails.join(',');

                const updateQuery = "UPDATE `clubs` SET `ownerEmail` = ? WHERE ownerEmail LIKE CONCAT('%', ?, '%');";
                adminconnection.query(updateQuery, [updatedEmailsStr, ownerEmail], (error, results) => {
                  if (error) {
                    res.send('Unknown error, contact Cole or support.');
                    console.log(error);
                  } else {
                    res.redirect('manage-club');
                  }
                });
              }
            });
          }
        }
      });
    } else {
      res.send("Access denied error.");
    }
  } catch (error) {
    res.send('Unknown error, contact Cole or support.');
    console.log(error);
  }
};


const removeOwnerEmail = async (req, res) => {
  await checkUserFile.checkForUser(req, res);

  const { newEmail } = req.body;
  const ownerEmail = req.session.email;
  if (ownerEmail === null || ownerEmail === undefined) {
    res.redirect('login');
    return;
  }

  try {
    const isAccessTrue = await checkAccess(req, res);

    if (isAccessTrue) {
      const selectQuery = "SELECT ownerEmail FROM `clubs` WHERE ownerEmail LIKE CONCAT('%', ?, '%') LIMIT 1;";
      adminconnection.query(selectQuery, [ownerEmail], (error, results) => {
        if (error) {
          res.send('Unknown error, contact Cole or support.');
          console.log(error);
        } else if(ownerEmail === results[0].ownerEmail) {
          res.redirect('manage-club');
          return;
        } else {
          const existingEmails = results[0].ownerEmail.split(',').map(email => email.trim());
          const updatedEmails = existingEmails.filter(email => email !== newEmail);
          const updatedEmailsStr = updatedEmails.join(',');

          const updateQuery = "UPDATE `clubs` SET `ownerEmail` = ? WHERE ownerEmail LIKE CONCAT('%', ?, '%');";
          adminconnection.query(updateQuery, [updatedEmailsStr, ownerEmail], (error, results) => {
            if (error) {
              res.send('Unknown error, contact Cole or support.');
              console.log(error);
            } else {
              res.redirect('manage-club');
            }
          });
        }
      });
    } else {
      res.send("Access denied error.");
    }
  } catch (error) {
    res.send('Unknown error, contact Cole or support.');
    console.log(error);
  }
};





module.exports = {
  createClubPost,
  clubApplyGet,
  clubCreatedGet,
  clubManageGet,
  updateInfoPost,
  addOwnerEmail,
  removeOwnerEmail
}