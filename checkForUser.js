const {
    usersModel
} = require('./database')
const checkForUser = async (req, res) => {
    try {
        if (req.session.email === null | req.session.email === undefined) {
            if (req.session.accountVerified === false) {
                res.redirect('/verify')
            }
            else {
                res.redirect('/login')
            }
            return;
        }
        const email = req.session.email;
        const query = { email: email };
        var results = await usersModel.find(query)
        if (results[0].isVerified != "true") {
            res.redirect('/login')
        }
        if (results.length === 0) {
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                }
                res.redirect('/login');
            });
        }
    } catch (error) {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred');
        }
    }
}
module.exports = {
    checkForUser
}