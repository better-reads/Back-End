const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// importing mongoose to create module for mongo connection
/*const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const url = process.env.MONGODB_URI;
const connect = mongoose.connect(url, { useMongoClient: true });

// connect to the database
connect.then((db) => {

    const db = mongoose.connection;

    console.log('connected to database: samplePOC');

}, (err) => console.log(err));*/

//Routers
const UsersRouter = require('../users/users-router.js');
const AuthRouter = require('../auth/auth-router.js')
const BooksRouter = require('../books/books-router.js')
//const ImageRouter = require('../images/image-router.js');

const server = express();

//Middleware
server.use(helmet());
server.use(cors());
server.use(express.json());

//Routes
server.use('/api/auth', AuthRouter)
server.use('/api/users', UsersRouter)
server.use('/api/books', BooksRouter)
//server.use('/api/images', ImageRouter)


server.get('/', (req, res) => {
    res.status(200).json("Welcome to the Better Reads database!")
})

module.exports = server;
