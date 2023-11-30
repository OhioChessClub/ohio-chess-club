// database.js
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: process.env.defaultHost,
    user: process.env.defaultUser,
    password: process.env.defaultPassword,
    database: process.env.defaultDatabase,
  });
  
  const adminConnection = mysql.createConnection({
    host: process.env.adminHost,
    user: process.env.adminUser,
    password: process.env.adminPassword,
    database: process.env.adminDatabase,
  });
  
connection.connect((err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`);
  } else {
    console.log("Website connected to database successfully");
  }
});

adminConnection.connect((err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`);
  } else {
    console.log("Admin users connected to database successfully");
  }
});

module.exports = {
  reconnect() {
    connection.connect((err) => {
      if (err) {
        console.log(`Error connecting to database: ${err}`);
      } else {
        console.log("Website connected to database successfully");
      }
    });
    
    adminConnection.connect((err) => {
      if (err) {
        console.log(`Error connecting to database: ${err}`);
      } else {
        console.log("Admin users connected to database successfully");
      }
    });
  },
  connection, 
  adminConnection
};
