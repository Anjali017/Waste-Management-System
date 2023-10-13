const express = require('express');
const sellerController = require('../controllers/authseller');
const buyerController = require('../controllers/authbuyer');
const muncipalityController = require('../controllers/authmuncipality');

const router = express.Router();

// SELLER
router.post('/sellerregister',sellerController.register)
router.post('/sellerlogin',sellerController.login)
router.get('/logout',sellerController.logout);



// BUYER
router.post('/buyerregister',buyerController.register)
router.post('/buyerlogin',buyerController.login)
router.get('/logout',buyerController.logout);

// MUNCIPALITY
router.post('/muncipalityregister',muncipalityController.register)
router.post('/muncipalitylogin',muncipalityController.login)
router.get('/logout',muncipalityController.logout);

module.exports = router;