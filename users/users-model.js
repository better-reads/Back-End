const db = require('../data/dbConfig.js')

module.exports = {
    addUser,
    updateUser,
    getUsers,
    getUserById,
    getUserByName
}

async function addUser(user) {
    const [id] = await db('users').insert(user, "id")
    return getUserById(id)
}

async function updateUser(changes, id) {
    const updated = await db('users').where({ id }).update(changes)
    return getUserById(id)
}

function getUsers() {
    return db('users')
        .select('username')
}

function getUserById(id) {
    return db('users')
        .where({ id })
        .select('id', 'username')
        .first()
}

function getUserByName(username) {
    return db('users')
        .where({ username })
        .first()
}