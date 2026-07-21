const SecondhandPhone = require('../models/SecondhandPhone');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(SecondhandPhone, {
  searchFields: ['brand', 'model', 'description'],
  filterFields: ['brand', 'condition', 'status'],
  publicFilter: { isActive: true, status: 'available' },
});
