// Libraries
const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');// Add the library

// Import Routers/helpers
// const usersRouter = require('./users/users-router.js');
const db = require('./users/users-model.js');
const protect = require('./auth/protect.js');

// Set Server
const server = express();
server.use(helmet());
server.use(express.json());

// Use Routers
// server.use('/api', usersRouter)


// Server Test. Hello Msg.
server.get('/', (req, res) => {
    res.send({ message: 'Hello from Patty. BE Week3-Day1 Project'})
});

server.get('/api/users', protect, (req, res) => {

    db.getUsers()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json(err.message)
    })
});

server.post('/api/register', (req, res) => {
    const user = req.body;

    // Hash Password
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;

    db.addNew(user)
    .then(regUser => {
        res.status(201).json(regUser)
    })
    .catch(err => {
        res.status(500).json(err.message)
    })
});

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.findUserBy({ username })
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
            res.status(200).json({ message: `You, ${user.username}, are now successfully logged in!`})
        } else {
            res.status(401).json({ message: 'Must use valid credentials.'})
        }
    })
    .catch(err => {
        res.status(500).json(err.message)
    })
});

module.exports = server;