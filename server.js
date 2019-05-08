// Libraries
const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');// Add the library
const session = require('express-session');//--------bring in library

// Import Routers/helpers
// const usersRouter = require('./users/users-router.js');
const db = require('./users/users-model.js');
const protect = require('./auth/protect.js');

// Configure Session
const sessionConfig = {
    name: "Patty's Playhouse", // defaults to sid otherwise.
    secret: "Secret, secret, I got a secret.", // could use a process.env variable to hide this.
    cookie: {
        httpOnly: true, //prevents access from JS code.
        maxAge: 1000 * 60 * 10, //milliseconds. This is 10mins.
        secure: false, //true means only send cookie over https
    },
    resave: false, //resave session even if it did/didnt change.
    saveUninitialized: true, //create new session automatically. Be sure to comply with law reqs.
};


// Set Server
const server = express();

server.use(session(sessionConfig));// server use session configuration.
server.use(helmet());
server.use(express.json());

// Use Routers
// server.use('/api', usersRouter)


// Server Test. Hello Msg.
server.get('/', (req, res) => {
    const username = req.session.username || 'person';

    res.send({ message: `Hello, ${username}, from Patty. BE Week3-Day1 Project`})
});


// Get Users.
server.get('/api/users', protect, (req, res) => {

    db.getUsers()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json(err.message)
    })
});

// Register User. Post.
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

// Login User. Post.
server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.findUserBy({ username })
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
            req.session.username = user.username;
            res.status(200).json({ message: `You, ${user.username}, are now successfully logged in! Here's a cookie.`})
        } else {
            res.status(401).json({ message: 'Must use valid credentials.'})
        }
    })
    .catch(err => {
        res.status(500).json(err.message)
    })
});

// Logout User. Post.
server.post('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
            res.status(500).json(err.message);
            } else {
                res.send('Successfully logged out.')
            }
        }) 
    } else {
        res.send('Already logged out.')
    }
});

module.exports = server;