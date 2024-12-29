// frontend/components/PurchaseForm.js
import { useState } from 'react';

export default function PurchaseForm() {
    const [formData, setFormData] = useState({
        product_code: '',
        product_type: '',
        brand: '',
        quantity: 0,
        price: 0.0,
        purchaseDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3001/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (response.ok) alert('Compra registrada con éxito');
        else alert('Error al registrar compra');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="product_code" placeholder="Código del producto" onChange={handleChange} required />
            <input type="text" name="product_type" placeholder="Tipo de producto" onChange={handleChange} required />
            <input type="text" name="brand" placeholder="Marca" onChange={handleChange} required />
            <input type="number" name="quantity" placeholder="Cantidad" onChange={handleChange} required />
            <input type="number" name="price" placeholder="Precio" step="0.001" onChange={handleChange} required />
            <input type="date" name="purchaseDate" onChange={handleChange} required />
            <button type="submit">Registrar Compra</button>
        </form>
    );
}
