const Books = require('../books/books-model.js')

//Middleware that checks to see if the book is in our database. It will then add it to the database. Either way, it passes the id of the book to the function.
async function bookInDbCheck(req, res, next) {
    const newBook = req.body
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

module.exports = bookInDbCheck