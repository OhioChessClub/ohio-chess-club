const { 
  featuresModel,
  titlesModel,
  coursesModel,
  unverifiedclubsModel,
  contactrequestsModel,
  viewsModel
} = require('./database')

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

const admin = async (req, res, accountInfo, title, description, canonicalUrl) => {
  try {
    var featuresResults = await featuresModel.find();
    feature1title = featuresResults[0].nameOfFeature;
    feautre1fontawesome = featuresResults[0].classValue;
    feature2title = featuresResults[1].nameOfFeature;
    feautre2fontawesome = featuresResults[1].classValue;
    feature3title = featuresResults[2].nameOfFeature;
    feautre3fontawesome = featuresResults[2].classValue;
    var titlesResults = await titlesModel.find();
    featuretitle = titlesResults[0].valueOfTitle;
    featuredesc = titlesResults[1].valueOfTitle;
    coursestitle = titlesResults[2].valueOfTitle;
    coursesdesc = titlesResults[3].valueOfTitle;
    mainTitle = titlesResults[4].valueOfTitle;
    mainDesc = titlesResults[5].valueOfTitle;
    mainButtonText = titlesResults[6].valueOfTitle;
    var coursesResults = await coursesModel.find();
    course1title = coursesResults[0].courseTitle
    course1description = coursesResults[0].courseDesc
    course2title = coursesResults[1].courseTitle
    course2description = coursesResults[1].courseDesc
    course3title = coursesResults[2].courseTitle
    course3description = coursesResults[2].courseDesc
    course4title = coursesResults[3].courseTitle
    course4description = coursesResults[3].courseDesc
    course5title = coursesResults[4].courseTitle
    course5description = coursesResults[4].courseDesc
    clubs = await unverifiedclubsModel.find();
    contactRequests = await contactrequestsModel.find();
    var viewsResults = await viewsModel.find();
    totalViews = viewsResults[0].totalViews;
    res.render(process.env.ADMIN_EJS_PAGE, {
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
      totalViews,
      title,
      description,
      accountInfo,
      title,
      description,
      canonicalUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

module.exports = {
  admin
}