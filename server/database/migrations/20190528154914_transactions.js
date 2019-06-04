exports.up = function(knex, Promise) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments();
    table
      .integer('purchased_by')
      .notNull()
      .references('id')
      .inTable('users');
    table
      .integer('shippingAddress_id')
      .notNull()
      .references('id')
      .inTable('shippingAddresses');
    table.decimal('tax', 8, 2).notNull();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('transactions');
};
