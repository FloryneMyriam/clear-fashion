const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://floryne:abc@cluster0.mcdh7dc.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashionDB';
const MONGODB_COLLECTION = 'clearfashionCollection';

const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
const db =  client.db(MONGODB_DB_NAME)


