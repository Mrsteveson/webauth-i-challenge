// Protect middleware helper
// Uses headers to check for logged in user.
const bcrypt = require('bcryptjs');
const db = require('../users/users-model.js');

function protect(req, res, next) {
    const { username, password } = req.headers;

    if(username && password) {
        db.findUserBy({ username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
               next();
            } else {
                res.status(401).json({ message: 'Must use valid credentials.'})
            }
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
    } else {
        res.status(401).json({ message: 'Hey Person, these credentials are invalid.'})
    }
}

module.exports = protect;