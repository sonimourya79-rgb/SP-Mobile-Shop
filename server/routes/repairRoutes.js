const buildRequestRouter = require('./requestRoutes');
const repairController = require('../controllers/repairController');

module.exports = buildRequestRouter(repairController);
