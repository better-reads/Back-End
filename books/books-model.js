const db = require('../data/dbConfig.js')
const axios = require('axios')

module.exports = {
    addBookToDb,
    findBookById,
    findBookByIsbn,
    saveBookToList,
    getSavedBookList,
    randomBooks
}

async function addBookToDb(book) {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`)
    const bookToSave = response.data.items[0].volumeInfo
    const bookPreview = response.data.items[0].accessInfo.webReaderLink
    const isbn10 = bookToSave.industryIdentifiers.find(isbn => isbn.type === "ISBN_10").identifier
    const isbn13 = bookToSave.industryIdentifiers.find(isbn => isbn.type === "ISBN_13").identifier
    const exampleBook = {
        title: bookToSave.title,
        author: bookToSave.authors[0],
        publisher: bookToSave.publisher,
        publishedDate: bookToSave.publishedDate,
        description: bookToSave.description,
        pageCount: bookToSave.pageCount,
        averageRating: bookToSave.averageRating,
        ratingsCount: bookToSave.ratingsCount,
        image: bookToSave.imageLinks.thumbnail,
        linkToBook: bookToSave.infoLink,
        isbn_10: isbn10,
        isbn_13: isbn13,
        genre: bookToSave.categories[0],
        maturityRating: bookToSave.maturityRating,
        previewLink: bookPreview
    }
    console.log(exampleBook)
    const [id] = await db('books').insert(book, "id")
    //return findBookById(id)
    return findBookById(id)
}

function findBookById(id) {
    return db('books')
        .where({ id })
        .first()
}

function findBookByIsbn(isbn) {
    return db('books')
        .where({ isbn })
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
        .select('b.title', 'b.isbn', 'b.id')
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
