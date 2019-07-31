const express = require('express')

const Books = require('./books-model.js')

const restricted = require('../auth/restricted-middleware.js')
const bookAlreadySaved = require('../middleware/bookAlreadySaved.js')
const bookInDbCheck = require('../middleware/bookInDbCheck.js')

const router = express.Router();

//saves a book to the user's saved list. Must be logged in to access.
router.post('/save/:id', restricted, bookInDbCheck, bookAlreadySaved, async (req, res) => {
    const addBook = {
        user_id: req.params.id,
        book_id: res.bookID //bookID comes from the bookInDbCheck middleware
    }

    try {
        const savedBook = await Books.saveBookToList(addBook);
        res.status(201).json(savedBook)
    } catch (err) {
        res.status(500).json({
            message: "Failed to save book."
        })
    }
})

//Deletes a book from the user's list. Must be logged in to access.
router.delete('/save/:user_id', restricted, async (req, res) => {
    const { user_id } = req.params
    const { book_id } = req.body

    try {
        const deleted = await Books.deleteBookFromList(user_id, book_id)

        if (deleted) {
            res.status(201).json({ deleted })
        } else {
            res.status(404).json({
                message: 'Could not find book with given id'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Failed to delete book.'
        });
    }
})

//adds a book to our database.
/*router.post('/add', async (req, res) => {
    const { isbn_10 } = req.body

    try {
        const book = await Books.addBookToDb(isbn_10)
        res.status(201).json(book)
    } catch (err) {
        res.status(500).json({
            message: "Failed to save book."
        })
    }
})*/

//Get all of the Books!
/*router.get('/', async (req, res) => {
    try {
        const books = await Books.getListOfBooks()
        res.status(201).json(books)
    } catch (err) {
        res.status(500).json({
            message: "There was an error retrieving the books."
        })
    }
})*/

//Sends entered description to the database and sends back recommended books.
router.get('/', async (req, res) => {
    try {
        const { description } = req.body
    } catch {
        res.status(500).json({
            message: "There is no data to return."
        })
    }
})



module.exports = router