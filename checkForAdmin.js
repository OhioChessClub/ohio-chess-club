function checkForAdmin(req, res, next) {
  if (req.session.loggedIn) {
    if (req.session.email === process.env.adminEmail) {
      return 'Authorized';
    }
  }
  else {
    return 'Unauthorized'
  }
}

module.exports = {
  checkForAdmin
}