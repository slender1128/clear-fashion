const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const {MongoClient} = require('mongodb');
const db = require('./db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/:id', async (request, response) => {
  const id = parseInt(request.params.id);
  const product = await db.find({'_id' : id});
  response.status(200).json({'result' : product[0]});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
