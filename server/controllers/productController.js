const Product = require('../models/Product');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Product, {
  searchFields: ['name', 'description'],
  filterFields: ['category'],
  publicFilter: { isActive: true },
  folder: 'sp-mobile/products',
});
