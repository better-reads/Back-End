const db = require('../data/dbConfig.js')

module.exports = {
    addBookToDb,
    findBookById,
    saveBookToList,
    getSavedBookList,
    randomBooks
}

async function addBookToDb(book) {
    const [id] = await db('books').insert(book, "id")
    return findBookById(id)
}

function findBookById(id) {
    return db('books')
        .where({ id })
        .first()
}

async function saveBookToList(book) {
    const [id] = await db('saved_list').insert(book, "id")
    return getSavedBookList(book.user_id)
}

function getSavedBookList(user_id) {
    return db('saved_list as s')
        .innerJoin('books as b', 's.book_id', 'b.id')
        .where({ user_id })
        .select('b.title', 's.liked')
}

function randomBooks() {
    return (
        [
            {
                title: "The Bell Jar",
                author: "Sylvia Plath",
                image: "https://covers.openlibrary.org/b/isbn/0061148512-M.jpg",
                isbn: "0061148512",
            },
            {
                title: "wordslut",
                author: "Amanda Montell",
                image: "https://covers.openlibrary.org/b/isbn/006286887X-M.jpg",
                isbn: "006286887X"
            },
            {
                title: "Normal People",
                author: "Sally Rooney",
                image: "https://covers.openlibrary.org/b/isbn/1984822179-M.jpg",
                isbn: "1984822179"
            },
            {
                title: "Feminist Theory: From Margin to Center",
                author: "Bell Hooks",
                image: "https://covers.openlibrary.org/b/isbn/0896086135-M.jpg",
                isbn: "0896086135"
            }
        ]
    )
}