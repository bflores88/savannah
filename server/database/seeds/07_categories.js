
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('categories').insert([
        {categoryName: 'Electronics'},
        {categoryName: 'Apparel'},
        {categoryName: 'Books'}
      ]);
    });
};