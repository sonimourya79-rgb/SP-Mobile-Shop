const buildCatalogRouter = require('./catalogRoutes');
const productController = require('../controllers/productController');

module.exports = buildCatalogRouter(productController);
