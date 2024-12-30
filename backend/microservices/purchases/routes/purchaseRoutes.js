// backend/microservices/purchases/routes/purchaseRoutes.js

// Importar dependencias
const express = require('express');
const { addPurchase, getPurchases, deletePurchase } = require('../controllers/purchaseController'); // Agregar controlador para eliminar compras

const router = express.Router();

// Ruta para agregar una nueva compra
router.post('/', (req, res, next) => {
    console.log(`[INFO] POST /purchases - Body:`, req.body); // Log para depuración
    next();
}, addPurchase);

// Ruta para obtener todas las compras
router.get('/', (req, res, next) => {
    console.log(`[INFO] GET /purchases`); // Log para depuración
    next();
}, getPurchases);

// Ruta para eliminar una compra específica por ID
router.delete('/:id', (req, res, next) => {
    console.log(`[INFO] DELETE /purchases/${req.params.id}`); // Log para depuración
    next();
}, deletePurchase);

module.exports = router;
