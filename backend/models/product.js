const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    brand: String,
    ean: String,
    dimension25: String,
    dimension26: Number,
    dimension24: Number,
    category: String,
    dimension9: String,
    dimension10: String,
})


module.exports = mongoose.model('Product', productSchema);