const RepairRequest = require('../models/RepairRequest');
const requestFactory = require('./requestFactory');

module.exports = requestFactory(RepairRequest);
