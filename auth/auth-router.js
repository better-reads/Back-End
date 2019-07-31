const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('../users/users-model.js')
const secrets = require('../config/secrets.js')

const restricted = require('./restricted-middleware.js')

//Register a new user
router.post('/register', uniqueNameCheck, (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
    }

    if (user.username && user.password) {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash

        Users.addUser(user)
            .then(saved => {
                console.log(saved)
                res.status(201).json(saved)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was a registration error."
                })
            })
    } else {
        res.status(400).json({
            message: "Username & password are required."
        })
    }
})

//Login a user
router.post('/login', (req, res) => {
    const { username, password } = req.body

    if (username && password) {
        Users.getUserByName(username)
            .then(user => {

                if (user && bcrypt.compareSync(password, user.password)) {
                    const token = generateToken(user)
                    res.status(200).json({
                        message: `${user.username} has successfully logged in!`, token
                    })
                } else {
                    res.status(401).json({
                        message: "Your username or password are incorrect."
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error logging in."
                })
            })
    } else {
        res.status(400).json({
            message: "Username & password are required."
        })
    }

})

//Update user. Allows you to update any or all of the user's fields (username, password, email, bio).
router.put('/:id', restricted, async (req, res) => {
    const { id } = req.params
    const changes = req.body

    if (changes.password) {
        const hash = bcrypt.hashSync(changes.password, 10);
        changes.password = hash
    }

    if (req.jwtToken.subject == id) {
        try {
            const user = await Users.getUserById(id)
            if (user) {
                const updatedUser = await Users.updateUser(changes, id)
                res.status(201).json(updatedUser)
            } else {
                res.status(400).json({
                    message: 'Could not find user with the given id.'
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "Failed to update the user."
            })
        }
    } else {
        res.status(401).json({
            message: "Users can only update their own information."
        })
    }
})

//Middleware used to generate a new JSON token
function generateToken(user) {
    const jwtPayload = {
        subject: user.id,
        username: user.username
    }

    const jwtOptions = {
        expiresIn: '1d'
    }

    return jwt.sign(jwtPayload, secrets.jwtSecret, jwtOptions)
}

//middleware
//Checks to see if the username is already in use.
async function uniqueNameCheck(req, res, next) {
    const { username } = req.body
    try {
        const user = await Users.getUserByName(username)
        user
            ? res.status(400).json({
                message: "A user with this name already exists."
            })
            : next()
    } catch {
        res.status(500).json({
            message: "There was an error."
        })
    }

}

module.exports = router;