const express = require('express');
const root = require("./api/root");
const search = require("./api/search");

const app = express();

const PORT = process.env.PORT || 27017;

app.use('/', root);
app.use('/products/search', search);

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));