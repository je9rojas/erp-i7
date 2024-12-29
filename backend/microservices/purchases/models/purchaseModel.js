// backend/microservices/purchases/models/purchaseModel.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    product_code: { type: String, required: true },
    product_type: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: mongoose.Decimal128, required: true },
    purchaseDate: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
