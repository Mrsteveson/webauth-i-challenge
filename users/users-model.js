const db = require('../data/dbConfig.js');

module.exports = {
    getUsers,
    getById,
    findUserBy,
    addNew,
}

function getUsers() {
    return db('users')
};

function getById(id) {
    return db ('users')
    .where({ id })
    .first()
};

function findUserBy(filter) {
    return db('users')
    .where(filter)
    .first()
};

function addNew(user) {
    return db('users')
    .insert(user)
    .then(newUser => {
        return getById(newUser[0])
    })
};