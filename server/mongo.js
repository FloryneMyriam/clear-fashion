
/*Connect the node.js server script*/

const fs = require('fs');
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

// Insert the products into the database 

async function insertProducts() {
  
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  var data = fs.readFileSync("C:/Users/Floryne/Web Architecture/clear-fashion/server/AllProducts.json");
  const products = JSON.parse(data);
  
  const collection = db.collection('products');
  await collection.deleteMany({});
  const result = await collection.insertMany(products);

  console.log(result)

  process.exit(0);
}

//insertProducts();

async function findProducts(dbUrl) {


  const client = await MongoClient.connect(dbUrl);
  const db = client.db(MONGODB_DB_NAME);

  const brand = 'DedicatedBrand';
  const maxPrice = 50;
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  
  const brandProducts = await db.collection('products').find({ brand }).toArray();
  console.log(`Brand products: ${brandProducts.length}`);
  
  const cheapProducts = await db.collection('products').find({ price: { $lt: maxPrice } }).toArray();
  console.log(`Cheap products: ${cheapProducts.length}`);

  const priceSortedProducts = await db.collection('products').find().sort({ price: 1 }).toArray();
  console.log(`Price sorted products: ${priceSortedProducts.length}`);

  const dateSortedProducts = await db.collection('products').find().sort({ scrapedAt: -1 }).toArray();
  console.log(`Date sorted products: ${dateSortedProducts.length}`);

  const recentProducts = await db.collection('products').find({ scrapedAt: { $gte: twoWeeksAgo } }).toArray();
  console.log(`Recent products: ${recentProducts.length}`);

  await client.close();
}

/*
// Find all products related to a given brands 

async function findProductsBrand(brand = null) {
  var result;
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');

  result = await collection.find({brand}).toArray()
  console.log(result);
  process.exit(0);
}

//findProductsBrand("DedicatedBrand");

// Find all products less than a price 
async function PriceFilter(Price) {	

	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
    const result = await collection.find({price: {$lt: Price}}).toArray();
    client.close();
	console.log(result);
}

//PriceFilter(50);

// Find all products sorted by price 

async function SortedByPrice() {	

	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
    const result = await collection.find().sort({price: -1}).toArray();//descending
    client.close();
	console.log(result);
}

//SortedByPrice();

// Find all products sorted by date 
async function SortedByDate() {	
    
	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
    const result = await collection.find().sort({date: -1}).toArray(); //descending
    client.close();
	console.log(result);
}

SortedByDate();

// Find all products scraped less than 2 weeks 

/*

async function productsSortedByPrice(order = "default") {
  if (order=="asc"){order = 1}
  else if (order == "desc") {order = -1}
  else {
    order = 1;
    console.log("By default the order is ascending")
  }
  var result;
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');

  result = await collection.find({}).sort({"price":order}).toArray()
  console.log(result);
  process.exit(0);
}
*/



