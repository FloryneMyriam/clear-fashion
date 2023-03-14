const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs')

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.produc-grid-container .grid__item')
    .map((i, element) => {
      const name = $(element)
        .find('.card__heading h5')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const particularity = $(element)
        .find('.card__characteristic')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.price__container')
          .text()
      );

      return {name, price};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();
      const products = parse(body);
      
      //json file
      jsonString = JSON.stringify(products);
      fs.writeFileSync('circlesportswear_products.json', jsonString)
      return products;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};