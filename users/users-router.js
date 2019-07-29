const express = require('express')

const Users = require('./users-model.js')
const Books = require('../books/books-model.js')

const router = express.Router()

//Get a list of a user's saved books by User ID
router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const bookList = await Books.getSavedBookList(id)
        res.status(200).json(bookList)
    } catch (err) {
        res.status(500).json({
            message: "There was an error locating the user's list."
        })
    }
})
module.exports = router