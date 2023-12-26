const {
    viewsModel
} = require('./database')

const titleMap = {
    // "viewFileName": "viewTItle"
    "404": "404: Page not found",
    "applyForClub": "Apply as Club Owner",
    "beingReviewed": "Your club is being reviewed.",
    "clubs": "Clubs",
    "contact": "Contact",
    "forgotPassword": "Reset your Password",
    "index": "Ohio Chess Club",
    "introductory-video-not-released": "Introductory Video",
    "introductory-video": "Introductory Video",
    "login": "Login",
    "manageClub": "Manage your Club",
    "manageClubUnverified": "Your club has not been verified",
    "register": "Register",
    "siteNotPublic": "Ohio Chess Club",
    "verify": "Verify your Email",
    "admin": "Admin"
}

const descMap = {
    // "viewFileName": "viewTItle"
    "404": "We cannot find this page on our servers.",
    "applyForClub": "Apply to be a club owner on the Ohio Chess Club.",
    "beingReviewed": "Your club you created is being reviewed for the Ohio Chess Club.",
    "clubs": "View all the clubs on the Ohio Chess Club.",
    "contact": "Contact the Ohio Chess Club.",
    "forgotPassword": "Change your account's password on the Ohio CHess Club.",
    "index": "The Ohio Chess club is the best completely free chess learning community.",
    "introductory-video-not-released": "View the Introductory Video.",
    "introductory-video": "View the Introductory Video.",
    "login": "Login to the Ohio Chess Club",
    "manageClub": "Manage your club on the Ohio Chess Club.",
    "manageClubUnverified": "Manage your club on the Ohio Chess Club.",
    "register": "Register an account for the Ohio Chess Club",
    "siteNotPublic": "The Ohio Chess club is the best completely free chess learning community.",
    "verify": "Verify your Email to Login to the Ohio Chess Club",
    "admin": "Perform admin operations on the Ohio Chess Club."
}

function getTitleFromFile(fileName) {
    if (titleMap.hasOwnProperty(fileName)) {
        return titleMap[fileName]
    }
    else {
        return "Non-Existant"
    }
}
function getDescFromFile(fileName) {
    if (descMap.hasOwnProperty(fileName)) {
        return descMap[fileName]
    }
    else {
        return "Non-Existant"
    }
}
async function updateViews(req, res) {
    try {
        var query = { id: 1 }
        var results = await viewsModel.find(query)
        var currentViews = results[0].totalViews;
        var newViews = currentViews + 1;
        await viewsModel.findOneAndUpdate(query, { totalViews: newViews })
    }
    catch (error) {
        if (error) {
            console.log("Error adding to views.")
        }
    }
}

// ONLY USEFUL FOR RENDERING WITHOUT EJS VARIABLES
async function renderView(fileName, req, res) {
    await updateViews(req, res);
    var title = getTitleFromFile(fileName);
    var description = getDescFromFile(fileName);
    res.render(fileName, { title, description })
}
module.exports = {
    renderView,
    updateViews,
    getDescFromFile,
    getTitleFromFile
}