function accountNotVerified(req, res, email) {
    req.session.email = email;
    req.session.accountPresent = true;
    req.session.accountVerified = false;
    req.session.loggedIn = false;
}
function logInAccount(req, res, email) {
    req.session.loggedIn = true;
    req.session.email = email;
    req.session.accountPresent = true;
    req.session.accountVerified = true;
}
function logoutAccount(req) {
    req.session.email = null;
    req.session.accountPresent = false;
    req.session.accountVerified = false;
    req.session.loggedIn = false;
}

function removeReturn(req, res) {
    req.session.loginReturnURL = null;
}

module.exports = {
    accountNotVerified,
    logInAccount,
    logoutAccount,
    removeReturn
}