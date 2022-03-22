require('dotenv').config();
const {MongoClient} = require('mongodb');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_URI = 'mongodb+srv://slender1128:a4b3c2d1@clearfashion.5edrj.mongodb.net/clearfashion?retryWrites=true&w=majority';

const getDB = async () => {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);
    return database;
}

const db = getDB();

module.exports = db;