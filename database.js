// database.js
const mongoose = require('mongoose');

async function connect() {
  try {
    mongoose.connect(`mongodb://${process.env.databaseURL}/${process.env.database}`)
    console.log('Database.js file has confirmed that database has connected.')
    return 'Connected'
  }
  catch (error) {
    console.error("ERROR CONNECTING TO MONGO DB: " + error)
    return 'ERROR CONNECTING: ' + error
  }
}

const Schema = mongoose.Schema;

const clubsSchema = new Schema({
  clubName: String,
  clubOwnerName: String,
  clubDescription: String,
  ownerEmail: String
}, {
  versionKey: false
});

const clubsModel = mongoose.model('clubs', clubsSchema)

const contactrequestsSchema = new Schema({
  email: String,
  name: String,
  question: String,
  isFulfilled: String
}, {
  versionKey: false
});

const contactrequestsModel = mongoose.model('contactrequests', contactrequestsSchema)

const coursesSchema = new Schema({
  id: Number,
  courseTitle: String,
  courseDesc: String
}, {
  versionKey: false
});

const coursesModel = mongoose.model('courses', coursesSchema)

const featuresSchema = new Schema({
  id: Number,
  nameOfFeature: String,
  classValue: String
}, {
  versionKey: false
});

const featuresModel = mongoose.model('features', featuresSchema)

const titlesSchema = new Schema({
  id: Number,
  valueOfTitle: String
}, {
  versionKey: false
});

const titlesModel = mongoose.model('titles', titlesSchema)

const unverifiedclubsSchema = new Schema({
  clubName: String,
  clubOwnerName: String,
  clubDescription: String,
  ownerEmail: String
}, {
  versionKey: false
});

const unverifiedclubsModel = mongoose.model('unverifiedclubs', unverifiedclubsSchema)

const usersSchema = new Schema({
  name: String,
  email: String,
  password: String,
  isVerified: String,
  verificationCode: Number,
  country: String,
  city: String,
  state: String,
  id: Number,
  changePasswordCode: Number
}, {
  versionKey: false
});

const usersModel = mongoose.model('users', usersSchema)

const viewsSchema = new Schema({
  id: Number,
  totalViews: Number
}, {
  versionKey: false
});

const viewsModel = mongoose.model('views', viewsSchema)

module.exports = {
  connect,
  clubsModel,
  contactrequestsModel,
  coursesModel,
  featuresModel,
  titlesModel,
  unverifiedclubsModel,
  usersModel,
  viewsModel
};