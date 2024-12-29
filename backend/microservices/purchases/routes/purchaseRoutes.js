// backend/microservices/purchases/routes/purchaseRoutes.js
const express = require('express');
const { addPurchase, getPurchases } = require('../controllers/purchaseController');

const router = express.Router();

router.post('/', addPurchase);
router.get('/', getPurchases);

module.exports = router;
