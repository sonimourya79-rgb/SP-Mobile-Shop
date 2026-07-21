const buildRequestRouter = require('./requestRoutes');
const sellController = require('../controllers/sellController');

module.exports = buildRequestRouter(sellController);
