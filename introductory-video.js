const { checkForAdmin } = require('./checkForAdmin')

const introductoryVideoRoute = async (req, res, title, description, accountInfo, canonicalUrl) => {
    var isAuthorized = await checkForAdmin(req);
    if(isAuthorized === 'Authorized'){
        res.render('introductary-video', { title, description, accountInfo, canonicalUrl })
    }
    else {
        res.render('introductory-video-not-released', { title, description, accountInfo, canonicalUrl })
    }
}

module.exports = {
    introductoryVideoRoute
}