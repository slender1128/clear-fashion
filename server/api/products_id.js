const cors = require('cors');
const express = require('express');
const router = express.Router();
const req = require('express/lib/request');
const helmet = require('helmet');
require('dotenv').config();
const {MongoClient} = require('mongodb');
const db = require('./db');

router.use(require('body-parser').json());
router.use(cors());
router.use(helmet());

router.options('*', cors());

router.get('/', async (request, response) => {
  const id = parseInt(request.params.id);
  const product = await db.find({'_id' : id});
  response.status(200).json({'result' : product});
});

module.exports = router;