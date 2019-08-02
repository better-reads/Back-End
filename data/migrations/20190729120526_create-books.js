
exports.up = function (knex, Promise) {
    return knex.schema.createTable('books', books => {
        books.increments();
        books
            .string('isbn')
            .notNullable()
            .unique()
        books.string('title')
        books.string('author')
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('books');
};
