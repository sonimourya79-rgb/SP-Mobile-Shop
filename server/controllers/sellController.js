const SellRequest = require('../models/SellRequest');
const requestFactory = require('./requestFactory');

module.exports = requestFactory(SellRequest, {
  kind: 'sell',
  adminLink: '/admin/sell-requests',
  customerLink: '/account/sell-requests',
});
