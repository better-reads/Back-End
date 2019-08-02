const Books = require('../books/books-model.js')

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

module.exports = bookAlreadySaved