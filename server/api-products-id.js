const cors = require('cors');
const express = require('express');
const req = require('express/lib/request');
const helmet = require('helmet');
require('dotenv').config();
const {MongoClient} = require('mongodb');
const db = require('./db');

const app = express();

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/:id', async (request, response) => {
  const id = parseInt(request.params.id);
  const product = await db.find({'_id' : id});
  response.status(200).json({'result' : product});
});

module.exports = app;