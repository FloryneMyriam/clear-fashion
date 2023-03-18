/**
 * Parse webpage montlimart t-shirts
 * @param  {String} data - html response
 * @return {Array} products
 */
const parseMontlimartTshirts = data => {
    const $ = cheerio.load(data);
  
    return $('.product-miniature')
      .map((i, element) => {
        const name = $(element)
          .find('.product-title')
          .text()
          .trim()
          .replace(/\s/g, ' ');
        const price = parseFloat(
          $(element)
            .find('.product-price')
            .attr('data-product-price')
        );
  
        return {name, price};
      })
      .get();
  };
  
  /**
   * Scrape all the products from Montlimart T-shirts for a given url page
   * @param  {[type]}  url
   * @return {Array|null}
   */
  module.exports.scrapeMontlimartTshirts = async url => {
    try {
      const response = await fetch(url);
  
      if (response.ok) {
        const body = await response.text();
  
        return parseMontlimartTshirts(body);
      }
  
      console.error(response);
  
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };