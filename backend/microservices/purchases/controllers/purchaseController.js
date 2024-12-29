// backend/microservices/purchases/controllers/purchaseController.js
const Purchase = require('../models/purchaseModel');

exports.addPurchase = async (req, res) => {
    try {
        const purchase = new Purchase(req.body);
        await purchase.save();
        console.log('Purchase added:', purchase);
        res.status(201).json(purchase);
    } catch (error) {
        console.error('Error adding purchase:', error);
        res.status(500).json({ error: 'Failed to add purchase' });
    }
};

exports.getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().sort({ purchaseDate: -1 });
        console.log('Fetched purchases:', purchases);
        res.status(200).json(purchases);
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ error: 'Failed to fetch purchases' });
    }
};
