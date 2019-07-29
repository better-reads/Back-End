
exports.up = function (knex, Promise) {
    return knex.schema.createTable('saved_list', saved_list => {
        saved_list.increments();

        saved_list
            .integer('user_id')
            .notNullable()
            .unsigned()
            .references("id")
            .inTable("users")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")

        saved_list
            .integer('book_id')
            .notNullable()
            .unsigned()
            .references("id")
            .inTable("books")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")

        saved_list
            .boolean('liked')
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('saved_list');
};
