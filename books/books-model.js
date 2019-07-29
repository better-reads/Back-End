const db = require('../data/dbConfig.js')

module.exports = {
    addBookToDb,
    findBookById,
    saveBookToList,
    getSavedBookList
}

async function addBookToDb(book) {
    const [id] = await db('books').insert(book, "id")
    console.log(id)
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