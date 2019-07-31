const express = require('express')

const Books = require('./books-model.js')

const router = express.Router();

//saves a book to the user's saved list.
router.post('/save/:id', bookInDbCheck, bookAlreadySaved, async (req, res) => {
    const addBook = {
        user_id: req.params.id,
        book_id: res.bookID
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

router.delete('/save/:user_id', async (req, res) => {
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
router.post('/add', async (req, res) => {
    const { isbn_10 } = req.body

    try {
        const book = await Books.addBookToDb(isbn_10)
        res.status(201).json(book)
    } catch (err) {
        res.status(500).json({
            message: "Failed to save book."
        })
    }
})

//Get all of the Books!
router.get('/', async (req, res) => {
    try {
        const books = await Books.getListOfBooks()
        res.status(201).json(books)
    } catch (err) {
        res.status(500).json({
            message: "There was an error retrieving the books."
        })
    }
})

//middleware
//Middleware that checks to see if the book is in our database. It will then add it to the database. Either way, it passes the id of the book to the function.
async function bookInDbCheck(req, res, next) {
    const newBook = req.body
    const bookCheck = await Books.findBookByIsbn(newBook.isbn_10)

    if (bookCheck) {
        res.bookID = bookCheck.id
        next()
    } else {
        const book = await Books.addBookToDb(newBook)
        res.bookID = book.id
        next()
    }
}

//Middleware that checks to see if the user has already saved the book to their list.
async function bookAlreadySaved(req, res, next) {
    const { id } = req.params

    const saveCheck = await Books.getSavedBookList(id)
    saveCheck.find(book => book.id === res.bookID)
        ? res.status(404).json({
            message: "This book is already saved to your list."
        })
        : next()
}

module.exports = router