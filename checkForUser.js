const { adminConnection, connection } = require('./database')
  

//   await checkUserFile.checkForUser(req, res);

const checkForUser = (req, res) => {
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

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred');
        }
        else if (results[0].isVerified != "true") {
            res.redirect('/login')
        }
        else if (results.length === 0) {
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                }
                res.redirect('/login');
            });
        }
    })
}

module.exports = {
    checkForUser
}