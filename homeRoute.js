// LOAD DOTENV
require('dotenv').config();



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

const { adminConnection, connection } = require('./database');

const homeRoute = async (req, res) => {

  let feature1title;
  let feautre1fontawesome;
  let feature2title;
  let feautre2fontawesome;
  let feature3title;
  let feautre3fontawesome;
  let featuretitle;
  let featuredesc;
  let coursestitle;
  let coursesdesc;
  let course1title;
  let course1description;
  let course2title;
  let course2description;
  let course3title;
  let course3description;
  let course4title;
  let course4description;
  let course5title;
  let course5description;
  let mainTitle;
  let mainDesc;
  let mainButtonText

  try {
    const query = 'SELECT * FROM features;';
    connection.query(query, async (error, results) => {
      if (error) {
        console.log(`Error getting posts: ${error}`);
      } else {
        feature1title = results[0].nameOfFeature;
        feautre1fontawesome = results[0].classValue;
        feature2title = results[1].nameOfFeature;
        feautre2fontawesome = results[1].classValue;
        feature3title = results[2].nameOfFeature;
        feautre3fontawesome = results[2].classValue;
      }

      const titlequery = 'SELECT * FROM titles;';
      connection.query(titlequery, async (error, results) => {
        if (error) {
          console.log(`Error getting titles: ${error}`)
        } else {
          featuretitle = results[0].valueOfTitle;
          featuredesc = results[1].valueOfTitle;
          coursestitle = results[2].valueOfTitle;
          coursesdesc = results[3].valueOfTitle;
          mainTitle = results[4].valueOfTitle;
          mainDesc = results[5].valueOfTitle;
          mainButtonText = results[6].valueOfTitle

          const coursequery = `SELECT * FROM courses`
          connection.query(coursequery, (error, results) => {
            if (error) {
              console.log(`Error getting titles: ${error}`)
            }
            else {
              course1title = results[0].courseTitle;
              course1description = results[0].courseDesc;
              course2title = results[1].courseTitle;
              course2description = results[1].courseDesc;
              course3title = results[2].courseTitle;
              course3description = results[2].courseDesc;
              course4title = results[3].courseTitle;
              course4description = results[3].courseDesc;
              course5title = results[4].courseTitle;
              course5description = results[4].courseDesc;
              res.render('index', {
                feature1title,
                feature1fontawesome: feautre1fontawesome,
                feature2title,
                feature2fontawesome: feautre2fontawesome,
                feature3title,
                feature3fontawesome: feautre3fontawesome,
                featuretitle,
                featuredesc,
                coursestitle,
                coursesdesc,
                course1title,
                course1description,
                course2title,
                course2description,
                course3title,
                course3description,
                course4title,
                course4description,
                course5title,
                course5description,
                mainTitle,
                mainDesc,
                mainButtonText
              });
            }
          })

        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}




module.exports = {
  homeRoute
};

