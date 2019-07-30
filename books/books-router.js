const express = require('express')

const Books = require('./books-model.js')

const router = express.Router();

router.post('/save/:id', async (req, res) => {
    const newBook = {
        book_id: req.body.book_id,
        user_id: req.params.id,
        liked: req.body.liked
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
        title: req.body.title
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
})

module.exports = router