require('dotenv').config();
const {MongoClient} = require('mongodb');
const db = require('./client.js');

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async query => {
  try {
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
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).limit(limit).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.collection = async () => {
  return db.collection(MONGODB_COLLECTION);
}