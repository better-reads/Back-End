const db = require('../data/dbConfig.js')

module.exports = {
    addUser,
    updateUser,
    getUsers,
    getUserById,
    getUserByName
}

//Adds a user to the db, returns full user info.
async function addUser(user) {
    const [id] = await db('users').insert(user, "id")
    return getUserById(id)
}

//Updates a user's info, returns full user info.
async function updateUser(changes, id) {
    const updated = await db('users').where({ id }).update(changes, "id")
    console.log(updated)
    return getUserById(id)
}

//Retrieves full list of users
function getUsers() {
    return db('users')
        .select('username')
}

//Retrieves user by ID
function getUserById(id) {
    return db('users')
        .where({ id })
        .select('id', 'username', 'email', 'bio', 'country', 'emailNotifications', 'firstName', 'lastName')
        .first()
}

//Retrieves user by username
function getUserByName(username) {
    return db('users')
        .where({ username })
        .first()
}