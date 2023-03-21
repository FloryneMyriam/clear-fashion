const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */


const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-grid-container .grid__item')
    .map((i, element) => {
      const brand = 'Circle Sportswear';

      const name = $(element)
        .find('.full-unstyled-link')
        .text()
        .trim()
        .replace(/ /g, ' ');

      const title = name.indexOf('\n'); // je veux récupérer seulement la première ligne du nom (je n'ai pas besoin de la description du produit)
      const name_product = name.substring(0, title);
       
      const color = [];
      $(element)
        .find('.color-variant-container').each((i, variant) => 
        {
          const colors = $(variant).find('.color-variant').attr('data-color');
          if (colors)
          {
            color.push(colors);
          }
        });

      const price = parseInt(
        $(element)
          .find('.money')
          .text()
          .split('€')[1]
      );

      const characteristics = $(element)
        .find('.card__characteristic')
        .text()
        .trim()

      // on ne veut pas de produits null
      if (name.length > 0)
      {
        return {brand, name_product, characteristics, color, price};
      } else{
        return null;
      }
    })
    .get()
    .filter(product => product !== null);

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
      jsonString = JSON.stringify(products, null, 2);
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