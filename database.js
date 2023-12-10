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

module.exports = {
  connection, 
  adminConnection
};
