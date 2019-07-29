
exports.up = function (knex, Promise) {
    return knex.schema.createTable('saved_list', saved_list => {
        saved_list.increments();

        saved_list
            .string('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')

        saved_list
            .string('book_id')
            .notNullable()
            .references('id')
            .inTable('books')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')

        saved_list
            .boolean('liked')
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('saved_list');
};
