const buildCatalogRouter = require('./catalogRoutes');
const secondhandController = require('../controllers/secondhandController');

module.exports = buildCatalogRouter(secondhandController);
