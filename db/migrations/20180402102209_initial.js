exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('mars_items', table => {
      table.increments('id').primary()
      table.string('item_name')
      table.boolean('packed')
      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('mars_items')
  ])
};
