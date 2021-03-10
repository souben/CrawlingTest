const express = require('express');
const app = express();
const cors = require('cors')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/crawling2', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on('connecting', () => console.error('connection connecting ...'))
db.on('open', () => console.log('connected successfully ~'))
db.on('error', (e) => console.error('connection error:', e))




var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const ProductModel = require('./models/product.js');

app.get('/', cors(corsOptions), async (req, res) => {
    const products = await ProductModel.find({});
    res.send(products);
})

app.listen(4000);




