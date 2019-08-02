const express = require('express')

const Books = require('./books-model.js')

const restricted = require('../middleware/restricted-middleware.js')
const bookAlreadySaved = require('../middleware/bookAlreadySaved.js')
const bookInDbCheck = require('../middleware/bookInDbCheck.js')

const router = express.Router();
const axios = require('axios')

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
    let { book_id } = req.body

    try {

        if (req.body.isbn) {
            const book = await Books.findBookByIsbn(req.body.isbn)
            book_id = book.id
        }

        const deleted = await Books.deleteBookFromList(user_id, book_id)

        if (deleted) {
            res.status(201).json({ deleted })
        } else {
            res.status(401).json({
                message: 'Could not find book with given id'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Failed to delete book.'
        });
    }
})

//call data science endpoint

router.post('/recommend', (req, res) => {
    const { description } = req.body

    axios.get(`http://brbhtest-env-1.ssrvdevc34.us-east-1.elasticbeanstalk.com/${description}`)
        .then(resp => {
            console.log(resp.data)
            res.send({ list: resp.data })
        })
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