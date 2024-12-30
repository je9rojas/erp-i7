// frontend/components/PurchaseTable.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Importar socket.io-client para conectarnos al WebSocket

export default function PurchaseTable() {
    const [purchases, setPurchases] = useState([]);
    const socket = io('http://localhost:3001'); // Conectar al WebSocket en el backend

    useEffect(() => {
        // Función para obtener las compras del backend
        const fetchPurchases = async () => {
            try {
                console.log('[INFO] Fetching purchases from backend...');
                const response = await fetch('http://localhost:3001/purchases');
                if (response.ok) {
                    const data = await response.json();
                    console.log('[INFO] Purchases data fetched:', data);
                    setPurchases(data); // Establecer las compras en el estado
                } else {
                    console.error('[ERROR] Failed to fetch purchases. Status:', response.status);
                }
            } catch (error) {
                console.error('[ERROR] Error fetching purchases:', error);
            }
        };

        // Llamar a la función para obtener las compras al cargar el componente
        fetchPurchases();

        // Escuchar el evento 'purchase-updated' para recibir notificaciones de nuevas compras
        socket.on('purchase-updated', () => {
            console.log('[INFO] Purchase updated event received. Refetching purchases...');
            fetchPurchases(); // Volver a obtener las compras después de una actualización
        });

        // Limpiar la conexión del WebSocket cuando el componente se desmonte
        return () => {
            socket.off('purchase-updated');
            console.log('[INFO] WebSocket connection closed');
        };
    }, [socket]);

    // Función para eliminar una compra
    const handleDelete = async (id) => {
        try {
            console.log(`[INFO] Attempting to delete purchase with id: ${id}`);
            const response = await fetch(`http://localhost:3001/purchases/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`[INFO] Purchase with id: ${id} deleted successfully`);
                // Actualizar el estado eliminando la compra eliminada
                setPurchases(purchases.filter(purchase => purchase._id !== id));
            } else {
                console.error(`[ERROR] Failed to delete purchase with id: ${id}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('[ERROR] Error deleting purchase:', error);
        }
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Tipo</th>
                        <th>Marca</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Fecha</th>
                        <th>Acciones</th> {/* Nueva columna para las acciones */}
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((purchase) => (
                        <tr key={purchase._id}>
                            <td>{purchase.product_code}</td>
                            <td>{purchase.product_type}</td>
                            <td>{purchase.brand}</td>
                            <td>{purchase.quantity}</td>
                            <td>{purchase.price.$numberDecimal}</td>
                            <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(purchase._id)} 
                                    style={{ color: 'red' }}
                                >
                                    Eliminar
                                </button>
                            </td> {/* Botón para eliminar la compra */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
