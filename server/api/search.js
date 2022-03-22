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
    let limit;
    if (request.query.limit == undefined) limit = 12;
    else limit = parseInt(request.query.limit);

    let brand;
    if (request.query.brand == undefined) brand = 'all';
    else brand = request.query.brand;

    let price;
    if (request.query.price == undefined || request.query.price == 'all') price = -1;
    else price = parseFloat(request.query.price);

    let db_request = {};
    if (brand != 'all') db_request['brand'] = brand;
    if (price >= 0) db_request['price'] = {'$lte' : price};

    const product = await db.find_limit(db_request, limit);
    response.send({'limit' : limit, 'total' : product.length, 'result' : product});
});

module.exports = router;