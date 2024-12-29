// frontend/components/PurchaseTable.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Importar socket.io-client para conectarnos al WebSocket

export default function PurchaseTable() {
    const [purchases, setPurchases] = useState([]);
    const socket = io('http://localhost:3001'); // Conectar al WebSocket en el backend

    useEffect(() => {
        // Función para obtener las compras del backend
        const fetchPurchases = async () => {
            console.log('[INFO] Fetching purchases from backend...');
            const response = await fetch('http://localhost:3001/purchases');
            const data = await response.json();
            console.log('[INFO] Purchases data fetched:', data);
            setPurchases(data); // Establecer las compras en el estado
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
