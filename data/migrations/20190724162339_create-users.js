
exports.up = function (knex) {
    return knex.schema.createTable('users', users => {
        users.increments();
        users
            .string('username')
            .notNullable()
            .unique();
        users.string('password', 128)
            .notNullable();
        users.string('bio')
        users.string('email')
        users.boolean('email-notifications')
        users.string('country')
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
};
