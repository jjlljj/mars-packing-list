
exports.seed = function(knex, Promise) {
  return knex('mars_items').del()
    .then(function () {
      return knex('mars_items').insert([
        {id: 1, item_name: 'hat', packed: true},
        {id: 2, item_name: 'sweater', packed: false},
        {id: 3, item_name: 'snacks', packed: true},
        {id: 4, item_name: 'air', packed: false},
      ]);
    });
    .catch(error => {});
};
