require('dotenv').config();
const {MongoClient} = require('mongodb');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = 'mongodb+srv://slender1128:a4b3c2d1@clearfashion.5edrj.mongodb.net/clearfashion?retryWrites=true&w=majority';

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {'useUnifiedTopology' : true, 'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async query => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

/**
 * Find products based on query with limit
 * @param  {Array}  query
 * @param   {int}   limit 
 * @return {Array}
 */
 module.exports.find_limit = async (query, limit) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).limit(limit).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};

module.exports.collection = async () => {
  const db = await getDB();
  return db.collection(MONGODB_COLLECTION);
}