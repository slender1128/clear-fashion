const cors = require('cors');
const express = require('express');
const router = express.Router();
const req = require('express/lib/request');
const helmet = require('helmet');
require('dotenv').config();
const {MongoClient} = require('mongodb');
const db = require('./db');
const { calculateLimitAndOffset, paginate } = require('paginate-info');

router.use(require('body-parser').json());
router.use(cors());
router.use(helmet());

router.options('*', cors());

router.get('/', async (request, response) => {
    /*
    if (request.query.limit == undefined) limit = 0;
    else limit = parseInt(request.query.limit);
    */

    //Pagination
    let page = 1;
    let size = 12;
    if (request.query.page != undefined) page = parseInt(request.query.page);
    if (request.query.size != undefined) size = parseInt(request.query.size);
    const {limit, offset} = calculateLimitAndOffset(page, size);

    //Filter by brand
    let brand;
    if (request.query.brand == undefined) brand = 'all';
    else brand = request.query.brand;

    //Filter by price
    let price;
    if (request.query.price == undefined || request.query.price == 'all') price = -1;
    else price = parseFloat(request.query.price);

    //Sort
    let sort = 'asc';
    if (request.query.sort != undefined) sort = request.query.sort;
    switch (sort)
    {
        case 'desc':
            sort = {"price" : -1};
            break;

        default:
            sort = {"price" : 1};
            break;
    }
    
    //Setting the request
    let db_request = {};
    if (brand != 'all') db_request['brand'] = brand;
    if (price >= 0) db_request['price'] = {'$lte' : price};

    //Setting the output
    const product = await db.find(db_request, limit, offset, sort);
    const total = await db.count(db_request);
    response.status(200).json({'currentPage' : page, 'pageCount' : Math.ceil(total/size), 'pageSize' : product.length, 'count' : total, 'result' : product});
});

module.exports = router;