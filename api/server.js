const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

//Routers
const UsersRouter = require('../users/users-router.js');
const AuthRouter = require('../auth/auth-router.js')
const BooksRouter = require('../books/books-router.js')

const server = express();

//Middleware
server.use(helmet());
server.use(cors());
server.use(express.json());

//Routes
server.use('/api/auth', AuthRouter)
server.use('/api/users', UsersRouter)
server.use('/api/books', BooksRouter)


server.get('/', (req, res) => {
    res.status(200).json("Hi")
})

module.exports = server;
