// backend/microservices/purchases/controllers/purchaseController.js

const Purchase = require('../models/purchaseModel'); // Importar el modelo de datos

// Controlador para agregar una nueva compra
exports.addPurchase = async (req, res) => {
    try {
        const purchase = new Purchase(req.body); // Crear una nueva instancia de Purchase con los datos del cuerpo de la solicitud
        await purchase.save(); // Guardar en la base de datos
        console.log('[INFO] Purchase added:', purchase); // Log de éxito
        res.status(201).json(purchase); // Responder con el objeto creado
    } catch (error) {
        console.error('[ERROR] Error adding purchase:', error); // Log de error
        res.status(500).json({ error: 'Failed to add purchase' }); // Respuesta de error
    }
};

// Controlador para obtener todas las compras
exports.getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().sort({ purchaseDate: -1 }); // Obtener las compras ordenadas por fecha
        console.log('[INFO] Fetched purchases:', purchases); // Log de éxito
        res.status(200).json(purchases); // Responder con las compras obtenidas
    } catch (error) {
        console.error('[ERROR] Error fetching purchases:', error); // Log de error
        res.status(500).json({ error: 'Failed to fetch purchases' }); // Respuesta de error
    }
};

// Controlador para eliminar una compra por ID
exports.deletePurchase = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la compra desde los parámetros de la ruta
        console.log(`[INFO] Attempting to delete purchase with ID: ${id}`); // Log para depuración
        const result = await Purchase.findByIdAndDelete(id); // Intentar eliminar la compra por ID

        if (!result) {
            console.log(`[WARNING] Purchase with ID: ${id} not found`); // Log si la compra no existe
            return res.status(404).json({ message: 'Purchase not found' }); // Respuesta si no se encuentra
        }

        console.log(`[INFO] Purchase with ID: ${id} deleted successfully`); // Log de éxito
        res.status(200).json({ message: 'Purchase deleted successfully' }); // Responder con éxito
    } catch (error) {
        console.error(`[ERROR] Error deleting purchase with ID: ${id}`, error); // Log de error
        res.status(500).json({ error: 'Internal server error' }); // Respuesta de error
    }
};
