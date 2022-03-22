const express = require('express');
const root = require("./api/root");
const search = require("./api/search");
const products_id = require("./api/products_id");

const app = express();

const PORT = process.env.PORT || 8092;

app.use('/', root);
app.use('/products/search', search);
app.use('/products/:id', products_id);

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));