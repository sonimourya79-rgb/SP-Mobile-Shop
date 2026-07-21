const SellRequest = require('../models/SellRequest');
const requestFactory = require('./requestFactory');

module.exports = requestFactory(SellRequest);
