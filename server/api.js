const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const fs = require('fs');

function getClient() {
    const uri = "mongodb+srv://floryne:abc@cluster0.mcdh7dc.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    return client;
}



app.get('/products/:id', (request, response) => {
  const id = request.params.id;
  const product = products.find(p => p._id === id);
  if (!product) {
    return response.status(404).send({ error: 'Product not found' });
  }
  response.send(product);
});

app.get('/products/search', (request, response) => {

  const limit = parseInt(req.query.limit) || 12;
  const brand = req.query.brand || 'All brands';
  const price = req.query.price || 'All price';

  const filteredProducts = products.filter(p => {
    return (brand === 'All brands' || p.brand === brand) &&
           (price === 'All price' || p.price === parseInt(price));
  });

  const total = filteredProducts.length;
  const results = filteredProducts.slice(0, limit).sort((a, b) => a.price - b.price);

  res.send({ limit, total, results });
});


app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

/*
// Endpoint to fetch the product
app.get('/products/:id', (request, response) => {
  const product = {
    "_id": "244fa0aa-ba21-59b7-8f74-ba6fed993746",
  "link": "https://www.loom.fr/collections/vestiaire-homme/products/le-t-shirt-homme",
  "brand": "loom",
  "price": 25,
  "name": "Le t-shirt",
  "photo":" //cdn.shopify.com/s/files/1/1355/7899/products/XT7oCJ0N-Il-jZBYBddhZdqc0Ilhb7f0USo1_1InOq8.jpg?v=1673023717&width=3000"
  };
  response.send(product);
});

// Endpoint to search for specific products
app.get('/products/search', (request, response) => {
  const product = {
    "limit": 10,
    "total": 5,
    "results": [
      {
        "_id": "244fa0aa-ba21-59b7-8f74-ba6fed993746",
        "link": "https://www.loom.fr/collections/vestiaire-homme/products/le-t-shirt-homme",
        "brand": "loom",
        "price": 25,
        "name": "Le t-shirt",
        "photo":" //cdn.shopify.com/s/files/1/1355/7899/products/XT7oCJ0N-Il-jZBYBddhZdqc0Ilhb7f0USo1_1InOq8.jpg?v=1673023717&width=3000"
      },
      {
        "_id": "1035e7a1-e4a3-55e0-9650-4594cf563a7f",
        "link": "https://www.loom.fr/collections/vestiaire-homme/products/le-boxer",
        "brand": "loom",
        "price": 20,
        "name": "Le boxer",
        "photo": "//cdn.shopify.com/s/files/1/1355/7899/products/CaJ7HhFr1595H4N4QftXl3CJQgsAZXcd9flFpMhtFFQ.jpg?v=1672828469&width=3000",
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Brushed Waves Navy",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Butterfly Oat White",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "Shirt Marstrand Butterfly Oat White",
        "price": 89
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Black",
        "price": 59
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Irregular Stripe Multi Color",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "Board Shorts Toroe Big Leaf Duck Green",
        "price": 79
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Big Leaf Duck Green",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Kramer Black",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Newman White",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "Shirt Marstrand Ocean Ink Multi Color",
        "price": 89
      },
      {
        "brand": "DedicatedBrand",
        "name": "Shirt Marstrand Zebra Blue",
        "price": 89
      },
      {
        "brand": "DedicatedBrand",
        "name": "Shirt Marstrand Palm Leaves Green",
        "price": 89
      },
      {
        "brand": "DedicatedBrand",
        "name": "Shirt Marstrand Black",
        "price": 79
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Seinfeld Family White",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm No Soup White",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Jerry Black",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm George Black",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "Windbreaker Skara Black",
        "price": 99
      },
      {
        "brand": "DedicatedBrand",
        "name": "Board Shorts Toroe Black",
        "price": 79
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Dusty Yellow",
        "price": 59
      },
      {
        "brand": "DedicatedBrand",
        "name": "Board Shorts Toroe Painted Palmtrees Black",
        "price": 79
      },
      {
        "brand": "DedicatedBrand",
        "name": "Board Shorts Toroe Ditsy Sun Copper Brown",
        "price": 79
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Zebra Blue",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Coral Gems Black",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Coral Gems Dusty Yellow",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Ditsy Sun Copper Brown",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Painted Palmtrees Black",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Sea Green",
        "price": 59
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Seabirds Sunset Multi Color",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "Swim Shorts Sandhamn Sodalite Blue",
        "price": 59
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Camp Fires Off-White",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm All Out Boat Off-White",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Base Dusty Yellow",
        "price": 29
      },
      {
        "brand": "DedicatedBrand",
        "name": "Sweatshirt Malmoe Base Dusty Yellow",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Base Cashmere Pink",
        "price": 29
      },
      {
        "brand": "DedicatedBrand",
        "name": "Sweatshirt Malmoe Base Cashmere Pink",
        "price": 69
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Shrigley Weed Off White",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Shrigley Microwave Off White",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Shrigley Dodo Off White",
        "price": 39
      },
      {
        "brand": "DedicatedBrand",
        "name": "T-shirt Stockholm Shrigley Bee Off White",
        "price": 39
      },
  
      {
          "brand": "Montlimart",
          "name": "T-SHIRT ESTIVAL",
          "color": "BEIGE/ECRU",
          "price": 60
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT INITIAL",
          "color": "BEIGE",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT AUDACIEUX",
          "color": "MARRON /BLANC /BEIGE",
          "price": 60
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT PROMETTEUR",
          "color": "BEIGE",
          "price": 60
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT ESSAIM",
          "color": "BLANC",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT INITIAL",
          "color": "BLANC",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT ICONE",
          "color": "ANIS",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT RESPECT",
          "color": "BLEU MARINE",
          "price": 75
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT SYMBOLE",
          "color": "BLEU MARINE",
          "price": 70
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT ICONE",
          "color": "BLEU CLAIR",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT ESSAIM",
          "color": "ROUGE",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT CITADIN",
          "color": "BLANC",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT IDEAL",
          "color": "ROUGE",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT IDEAL",
          "color": "GRIS CLAIR",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT LIGUE",
          "color": "KAKI",
          "price": 70
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT SYMBOLE",
          "color": "KAKI CLAIR",
          "price": 70
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT RESPECT",
          "color": "NOIR",
          "price": 75
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT ESSAIM",
          "color": "ANTHRACITE",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT RESPECT",
          "color": "TERRACOTTA",
          "price": 75
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT ESSAIM",
          "color": "GRIS CHINE",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT BLASON",
          "color": "BLEU MARINE",
          "price": 65
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT IDEAL",
          "color": "BLEU MARINE",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT LIGUE",
          "color": "BLEU CLAIR",
          "price": 70
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT RESPECT",
          "color": "GRIS CLAIR",
          "price": 75
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT JOUEUR",
          "color": "BLEU CLAIR",
          "price": 70
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT BLASON",
          "color": "GRIS CHINE",
          "price": 65
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT ESSAIM",
          "color": "BLEU MARINE",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT ESSAIM",
          "color": "VERT",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT RESPECT",
          "color": "VERT",
          "price": 75
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT INITIAL",
          "color": "VERT",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT INITIAL",
          "color": "BLEU ELECTRIQUE",
          "price": 55
        },
        {
          "brand": "Montlimart",
          "name": "T-SHIRT ICONE",
          "color": "MARRON",
          "price": 55
        },
  
        {
          "brand": "Circle Sportswear",
          "name_product": "Crop-top sport Smooth Operator",
          "characteristics": "Doux - LégerDoux - Léger",
          "color": [
            "Burgundy Red",
            "Sand",
            "Onyx Black",
            "Moss",
            "Minty Fresh",
            "Lilac"
          ],
          "price": 59
        },
        {
          "brand": "Circle Sportswear",
          "name_product": "T-shirt de Sport Iconic POP",
          "characteristics": "Léger - RespirantLéger - Respirant",
          "color": [
            "Navy",
            "Minty Fresh"
          ],
          "price": 65
        },
        {
          "brand": "Circle Sportswear",
          "name_product": "T-shirt Jim",
          "characteristics": "Coupe AmpleCoupe Ample",
          "color": [
            "Purple Rain"
          ],
          "price": 69
        },
        {
          "brand": "Circle Sportswear",
          "name_product": "T-shirt de Sport Get Ready Quick Dry",
          "characteristics": "Technique - ConfortableTechnique - Confortable",
          "color": [
            "Granite Grey"
          ],
          "price": 59
        },
        {
          "brand": "Circle Sportswear",
          "name_product": "T-shirt Iconic Social",
          "characteristics": "Léger - RespirantLéger - Respirant",
          "color": [
            "Noire"
          ],
          "price": 50
        },
        {
          "brand": "Circle Sportswear",
          "name_product": "T-shirt de Sport Get Ready",
          "characteristics": "Léger - RespirantLéger - Respirant",
          "color": [
            "Moss",
            "Onyx Black"
          ],
          "price": 59
        }
    ]
  }
});
*/
