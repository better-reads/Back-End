
exports.up = function (knex, Promise) {
    return knex.schema.createTable('books', books => {
        books.increments();

        books
            .string('title')
            .notNullable()
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('books');
};
