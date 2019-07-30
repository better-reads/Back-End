const express = require('express')

const Books = require('./books-model.js')

const router = express.Router();

router.post('/save/:id', bookInDbCheck, async (req, res) => {
    const newBook = {
        user_id: req.params.id,
        isbn: req.body.isbn
    }


    try {
        const savedBook = await Books.saveBookToList(newBook);
        res.status(201).json(savedBook)
    } catch (err) {
        res.status(500).json({
            message: "Failed to save book."
        })
    }
})

router.post('/add', async (req, res) => {
    const newBook = {
        title: req.body.title,
        isbn: req.body.isbn
    }

    try {
        const book = await Books.addBookToDb(newBook)
        res.status(201).json(book)
    } catch (err) {
        res.status(500).json({
            message: "Failed to save book."
        })
    }
})

router.get('/recommend', async (req, res) => {
    const input = {
        text: req.body.text,
        genre: req.body.genre,
        author: req.body.author
    }
    try {
        const books = await Books.randomBooks()
        res.status(201).json(books)
    } catch (err) {
        res.status(500).json({
            message: "Failed to retrieve books."
        })
    }
})

//middleware

async function bookInDbCheck(req, res, next) {
    const newBook = {
        isbn: req.body.isbn,
        title: req.body.title
    }

    const bookCheck = await Books.findBookById(newBook.isbn)

    if (bookCheck.title) {
        const book = await Books.addBookToDb(newBook)
    }

    next()
}

module.exports = router