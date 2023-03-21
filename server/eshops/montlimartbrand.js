const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */

/*
const parse = data => {
    const $ = cheerio.load(data);

    return $('.product-miniature .product-list__block*')
        .map((i, element) => {
            const name = $(element)
                .find('product-miniature__title')
                .text()
                .trim()
                .replace(/\s/g, ' ');
            const color = $(element)
                .find('product-miniature__color')
                .text()
                .trim()
                .replace(/\s/g, ' ');
            const price = parseFloat(
                $(element)
                .find('.product-miniature__pricing')
                .text()
        );

            return {name, color, price};
        })
        .get();
};
*/

const scrapeProducts = async (url) => {
    const products = [];
  
    try {
      const response = await fetch(url);
  
      if (response.ok) {
        const htmlText = await response.text();
        const $ = cheerio.load(htmlText);
  
        $('.product-miniature').each((index, element) => {
          const brand = "Montlimart";
          const name = $(element)
            .find('.product-miniature__title')
            .text()
            .trim()
            .toLowerCase()
            .replace(/^\w/, capitalize);    //capitalize?
          const price = parseFloat($(element)
            .find('.product-miniature__pricing')
            .text()
            .replace(',', '.'));
          const color = $(element)
            .find('.product-miniature__color')
            .text()
            .trim()
            .toLowerCase()
            .replace(/^\w/, capitalize);
  
          products.push({ brand, name, price, color });
        });
      } else {
        console.error(`Error fetching products. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error scraping products: ${error}`);
    }
  
    return products;
  };

/**
 * Scrape all the products for a given url page
 * @param  {[type]} url
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
            fs.writeFileSync('montlimard_products.json', jsonString)
            return products;
        }

        console.error(response);

    return null;
  } 
    catch (error) 
    {
        console.error(error);
        return null;
    }
};
