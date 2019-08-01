const db = require('../data/dbConfig.js')

module.exports = {
    addBookToDb,
    findBookById,
    findBookByIsbn,
    saveBookToList,
    deleteBookFromList,
    getSavedBookList,
    getListOfBooks
}

//adds a book to the database, returns the book's info.
async function addBookToDb(book) {
    const [id] = await db('books').insert(book, "id")
    return findBookById(id)
}

//Retrieves book from the database based on id.
function findBookById(id) {
    return db('books')
        .where({ id })
        .first()
}

//Retrieves a book from the database using its ISBN.
function findBookByIsbn(isbn) {
    return db('books')
        .where({ isbn })
        .first()
}

//Saves a book to the user's list.
async function saveBookToList(book) {
    const [id] = await db('saved_list').insert(book, "id")
    return getSavedBookList(book.user_id)
}

//Deletes a book from the user's list.
async function deleteBookFromList(user_id, book_id) {
    const deleted = await db('saved_list').where({ user_id }).andWhere({ book_id }).del()
    return deleted
}

//Retrieves a list of the user's saved books.
function getSavedBookList(user_id) {
    return db('saved_list as s')
        .innerJoin('books as b', 's.book_id', 'b.id')
        .where({ user_id })
        .select('b.id', 'b.title', 'b.author', 'b.isbn')
}

//Retrieves list of all books in the DB.
function getListOfBooks() {
    return db('saved_list as s')
        .innerJoin('books as b', 's.book_id', 'b.id')
        .select('s.user_id', 's.book_id', 'b.isbn', 'b.title', 'b.author')
}
