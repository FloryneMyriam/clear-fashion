
/*Connect the node.js server script*/


const MONGODB_DB_NAME = 'clearfashionDB';
const MONGODB_COLLECTION = 'clearfashionCollection';



const { MongoClient, ServerApiVersion } = require('mongodb');
const MONGODB_URI = "mongodb+srv://floryne:abc@cluster0.mcdh7dc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

/* Insert the products into the database */

/*
const products = [];

const collection = db.collection('products');
const result = collection.insertMany(products);

console.log(result);
*/

async function insertProducts() {
  
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  var data = fs.readFileSync("C:\Users\Floryne\Web Architecture\clear-fashion\server\AllProducts.json");
  const products = JSON.parse(data);
  
  const collection = db.collection('products');
  await collection.deleteMany({});
  const result = await collection.insertMany(products);

  console.log(result)

  process.exit(0);
}
