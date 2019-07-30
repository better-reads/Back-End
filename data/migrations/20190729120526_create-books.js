
exports.up = function (knex, Promise) {
    return knex.schema.createTable('books', books => {
        books.increments();
        books
            .string('title')
            .notNullable()
        books.string('author')
        books.string('publisher')
        books.string('published_date')
        books.string('description')
        books.string('page_count')
        books.string('average_rating')
        books.string('ratings_count')
        books.string('image')
        books.string('book_link')
        books
            .string('isbn_10')
            .notNullable()
            .unique()
        books.string('isbn_13')
        books.string('genre')
        books.string('maturity_rating')
        books.string('preview_link')
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('books');
};
