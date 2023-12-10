// LOAD DOTENV
require('dotenv').config();

// LOAD MYSQL MODULES AND CONNECT TO DB
const { adminConnection, connection } = require('./database')

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
let mainTitle;
let mainDesc
let mainButtonText
let course1title
let course1description
let course2title
let course2description
let course3title
let course3description
let course4title
let course4description
let course5title
let course5description
let contactRequests
let clubs;
let totalViews;

const admin = async (req, res) => {
  try {
    const query = 'SELECT * FROM features;';

    await adminConnection.query(query, async (error, results) => {
      if (error) {
        console.log(`Error getting posts: ${error}`);
      } else {
        feature1title = results[0].nameOfFeature;
        feautre1fontawesome = results[0].classValue;
        feature2title = results[1].nameOfFeature;
        feautre2fontawesome = results[1].classValue;
        feature3title = results[2].nameOfFeature;
        feautre3fontawesome = results[2].classValue;

        // Start #2

        const titlequery = 'SELECT * FROM titles;';
        await adminConnection.query(titlequery, async (error, results) => {
          featuretitle = results[0].valueOfTitle;
          featuredesc = results[1].valueOfTitle;
          coursestitle = results[2].valueOfTitle;
          coursesdesc = results[3].valueOfTitle;
          mainTitle = results[4].valueOfTitle;
          mainDesc = results[5].valueOfTitle;
          mainButtonText = results[6].valueOfTitle;



          const getCoursesSQL = `SELECT * FROM courses`
          await adminConnection.query(getCoursesSQL, async (error, results) => {
            course1title = results[0].courseTitle
            course1description = results[0].courseDesc
            course2title = results[1].courseTitle
            course2description = results[1].courseDesc
            course3title = results[2].courseTitle
            course3description = results[2].courseDesc
            course4title = results[3].courseTitle
            course4description = results[3].courseDesc
            course5title = results[4].courseTitle
            course5description = results[4].courseDesc
            // const course6title = results[5].courseTitle
            // const course6description = results[5].courseDesc


            const getUnverifiedClub = "SELECT * FROM `unverifiedclubs`";
            await adminConnection.query(getUnverifiedClub, async (error, results) => {
              if (error) {
                console.log(`Error getting clubs: ${error}`)
              }
              clubs = results;


              const getContactRequestsQuery = "SELECT * FROM contactrequests WHERE isFulfilled = 'n'";

              await adminConnection.query(getContactRequestsQuery, async (error, results) => {
                contactRequests = results;

                var getViewCount = "SELECT * FROM `views` WHERE id = 1"
                await adminConnection.query(getViewCount, async (error, results) => {
                  totalViews = results[0].totalViews;
                  res.render(process.env.ADMIN_UPDATE_PAGE, {
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
                    mainButtonText,
                    clubs,
                    contactRequests,
                    totalViews
                    // course6title,
                    // course6description
                  });
                })


              })
            })
          })
        });
      }
    })


  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

module.exports = {
  admin
}