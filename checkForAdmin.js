function checkForAdmin(req, res, next) {
    if (req.session.loggedIn) {
      if (req.session.email === process.env.adminEmail) {
        return next();
      }
    }
    res.status(404).render('404');
  }