const express = require('express')

const Users = require('./users-model.js')
const Books = require('../books/books-model.js')

const restricted = require('../auth/restricted-middleware.js')

const router = express.Router()

//Get a list of a user's saved books by User ID
router.get('/list/:id', async (req, res) => {
    const { id } = req.params

    try {
        const bookList = await Books.getSavedBookList(id)
        if (bookList.length > 0) {
            res.status(200).json(bookList)
        } else {
            res.status(401).json({
                message: "The user has no books saved to their list."
            })
        }

    } catch (err) {
        res.status(500).json({
            message: "There was an error locating the user's list."
        })
    }
})


//Get user info
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await Users.getUserById(id)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({
            message: "There was an error locating the user."
        })
    }
})

module.exports = router