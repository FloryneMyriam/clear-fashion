/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circlesportswearbrand = require('./eshops/circlesportswearbrand');

const link_dedicated = 'https://www.dedicatedbrand.com/en/men/news';
const link_montlinmart = 'https://www.montlimart.com/101-t-shirts';
const link_circlesportswear = 'https://shop.circlesportswear.com/collections/t-shirt-femme';


async function sandbox(eshop = link_dedicated) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);
    
    if (products.length === 0) {
      console.log('No products found');
    } else {
      console.log(products);
    }

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
