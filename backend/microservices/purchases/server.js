// backend/microservices/purchases/server.js

// Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Para manejar las políticas de CORS
const http = require('http'); // Necesario para crear un servidor HTTP
const socketIo = require('socket.io'); // Importar socket.io
const purchaseRoutes = require('./routes/purchaseRoutes');
require('dotenv').config(); // Cargar variables de entorno desde .env

// Crear instancia de la aplicación Express
const app = express();
const server = http.createServer(app); // Usamos http.createServer para habilitar WebSockets
const io = socketIo(server); // Configuramos socket.io en el servidor

const PORT = 3001;

// Middleware
app.use(express.json()); // Middleware para analizar solicitudes JSON
app.use(cors()); // Habilitar CORS para permitir solicitudes desde el front-end

// Rutas
// Registrar el enrutador para las operaciones de 'purchases'
app.use('/purchases', (req, res, next) => {
    console.log(`[INFO] Request recibido: ${req.method} ${req.originalUrl}`);
    next();
}, purchaseRoutes);

// Ruta para eliminar una compra por su ID
app.delete('/purchases/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[INFO] Attempting to delete purchase with id: ${id}`);
        
        const purchase = await Purchase.findByIdAndDelete(id); // Eliminar la compra de la base de datos
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }
        
        console.log(`[INFO] Purchase with id: ${id} deleted successfully`);
        res.status(200).json({ message: 'Purchase deleted successfully' });

        // Emitir el evento 'purchase-updated' para notificar a los clientes conectados
        io.emit('purchase-updated');
    } catch (error) {
        console.error('[ERROR] Error deleting purchase:', error);
        res.status(500).json({ message: 'Error deleting purchase' });
    }
});

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('[INFO] Database connected successfully'))
    .catch(err => console.error('[ERROR] Database connection error:', err));

// Escuchar las conexiones WebSocket
io.on('connection', (socket) => {
    console.log('[INFO] Un cliente se ha conectado a WebSocket');

    // Notificar cuando haya una nueva compra
    socket.on('new-purchase', () => {
        console.log('[INFO] Nueva compra registrada. Enviando actualización a los clientes...');
        // Emitir un evento 'purchase-updated' para todos los clientes conectados
        socket.broadcast.emit('purchase-updated');
    });

    // Desconectar cuando un cliente se desconecte
    socket.on('disconnect', () => {
        console.log('[INFO] Un cliente se ha desconectado de WebSocket');
    });
});

// Iniciar servidor HTTP con WebSocket
server.listen(PORT, () => {
    console.log(`[INFO] Purchases service running on port ${PORT}`);
    console.log(`[INFO] Esperando solicitudes en http://localhost:${PORT}/purchases`);
});
