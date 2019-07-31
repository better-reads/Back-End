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

async function addBookToDb(book) {
    /*const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn_10}`)
    const bookToSave = response.data.items[0].volumeInfo
    const bookPreview = response.data.items[0].accessInfo.webReaderLink
    const exampleBook = {
        title: bookToSave.title,
        author: bookToSave.authors[0],
        publisher: bookToSave.publisher,
        published_date: bookToSave.publishedDate,
        description: bookToSave.description,
        page_count: bookToSave.pageCount,
        average_rating: bookToSave.averageRating,
        ratings_count: bookToSave.ratingsCount,
        image: bookToSave.imageLinks.thumbnail,
        book_link: bookToSave.infoLink,
        isbn_10: bookToSave.industryIdentifiers[1].identifier,
        isbn_13: bookToSave.industryIdentifiers[0].identifier,
        genre: bookToSave.categories[0],
        maturity_rating: bookToSave.maturityRating,
        preview_link: bookPreview
    }*/
    const [id] = await db('books').insert(book, "id")
    return findBookById(id)
}

function findBookById(id) {
    return db('books')
        .where({ id })
        .first()
}

function findBookByIsbn(isbn_10) {
    return db('books')
        .where({ isbn_10 })
        .first()
}


async function saveBookToList(book) {
    const [id] = await db('saved_list').insert(book, "id")
    return getSavedBookList(book.user_id)
}

async function deleteBookFromList(user_id, book_id) {
    const deleted = await db('saved_list').where({ user_id }).andWhere({ book_id }).del()
    return deleted
}

function getSavedBookList(user_id) {
    return db('saved_list as s')
        .innerJoin('books as b', 's.book_id', 'b.id')
        .where({ user_id })
        .select('b.id', 'b.title', 'b.author', 'b.isbn_10')
}

function getListOfBooks() {
    return db('saved_list as s')
        .innerJoin('books as b', 's.book_id', 'b.id')
        .select('s.user_id', 's.book_id', 'b.isbn_10', 'b.title', 'b.author')
}
