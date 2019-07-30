const express = require('express')
const axios = require('axios')

const Books = require('./books-model.js')

const router = express.Router();

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

router.post('/add', async (req, res) => {
    const newBook = {
        isbn: req.body.isbn
    }

    try {
        const book = await Books.addBookToDb(newBook)
        res.status(201).json(newBook)
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

    const bookCheck = await Books.findBookByIsbn(newBook.isbn)

    if (bookCheck) {
        res.bookID = bookCheck.id
        next()
    } else {
        const book = await Books.addBookToDb(newBook)
        res.bookID = book.id
        next()
    }
}

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