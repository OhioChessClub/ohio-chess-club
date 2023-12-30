const {
  clubsModel
} = require('./database')

const viewClubsGet = async (req, res, accountInfo, title, description, canonicalUrl) => {
  var clubs = await clubsModel.find()
  res.render('clubs', { title, description, clubs: clubs, accountInfo, canonicalUrl })
}



module.exports = {
  viewClubsGet,
}