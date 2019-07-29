
exports.up = function (knex, Promise) {
    return knex.schema.createTable('saved_list', saved_list => {
        saved_list.increments();

        saved_list
            .integer('user_id')
            .notNullable()

        saved_list
            .float('book_id')
            .notNullable()

        saved_list
            .boolean('liked')
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('saved_list');
};
