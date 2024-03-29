const { checkForAdmin } = require('./checkForAdmin')

const introductoryVideoRoute = async (req, res, accountInfo, title, description, canonicalUrl) => {
    var isAuthorized = await checkForAdmin(req);
    if(isAuthorized === 'Authorized'){
        res.render('introductory-video', { title, description, accountInfo, canonicalUrl })
    }
    else {
        res.render('introductory-video-not-released', { title, description, accountInfo, canonicalUrl })
    }
}

module.exports = {
    introductoryVideoRoute
}