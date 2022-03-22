const cors = require('cors');
const express = require('express');
const router = express.Router();
const req = require('express/lib/request');
const helmet = require('helmet');
require('dotenv').config();
const {MongoClient} = require('mongodb');

router.use(require('body-parser').json());
router.use(cors());
router.use(helmet());

router.options('*', cors());

router.get('/', (request, response) => {
    response.send({'result': []});
});

module.exports = router;