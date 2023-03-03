// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand=document.querySelector('#brand-select');
const selectSort=document.querySelector('#sort-select');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products.map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Feature 0
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Feature 1 - Browse pages
 */

selectPage.addEventListener('change', async (event) => {
  const page = parseInt(event.target.value);
  const products = await fetchProducts(page /*, size=undefined */);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/* 
 * Feature 2 - Filter by brands
*/

selectBrand.addEventListener('change', async (event) => {
  products = await fetchProducts(currentPagination.currentPage, selectShow.value);
  products.result=products.result.filter(product=>product.brand==event.target.value)
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/* Feature 3 - Filter by recent products */

selectSort.addEventListener('change', async (event) => 
{
  products = await fetchProducts(currentPagination.currentPage, selectShow.value, selectBrand.value);
  if (selectSort.value='date-asc')
  {
    const two_weeks_ago=new Date(products.result.released);
    two_weeks_ago.setDate(two_weeks_ago.getDate() - 14);
    products.result=products.result.filter(products => Date(products.released) > two_weeks_ago);
  }
  else {event.target.value=''}
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/* Feature 4 - Filter by reasonable price */

selectShow.addEventListener('change', async (event) =>
{
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
})

/* essai 1

selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  const brands_products = products.map((products) => products.brand);

  setCurrentProducts(brands_products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const brands_products = await fetchProducts();

  setCurrentProducts(brands_products);
  render(currentProducts, currentPagination);
});
*/

/* essai 2

selectPage.addEventListener('change', async (event) => {
  const page = parseInt(event.target.value);
  const products = await fetchProducts(page);
  const brands_products = products.map((products) => products.brand);

  setCurrentProducts(brands_products);
  render(currentProducts, currentPagination);
});

*/

/*
const recent_products = currentProducts.filter(product => products.brand);
console.log(recent_products);*/


/** 
// Declare the brand selector
const selectBrand = document.querySelector('#brand-select');

const filterProductsByBrand = (brand) => {
  return currentProducts.filter(product => product.brand.toLowerCase().includes(brand.toLowerCase()));
};

// Add an event listener to the brand selector
selectBrand.addEventListener('change', () => {
  // Filter the products by brand
  const brand = event.target.value;
  const filteredProducts = filterProductsByBrand(brand);
  setCurrentProducts({result: filteredProducts, meta: currentPagination});
  render(currentProducts, currentPagination);

  /*const filteredProducts = currentProducts.filter(product => product.brand === selectBrand.value, size=undefined);
  */

  // Render the filtered products

  /*
  render(filteredProducts, { count: filteredProducts.length });
});

*/

/*

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

*/

/* Feature 5 - Sort by price */

/* Feature 6 - Sort by date */

/* Feature 8 - Number of products indicator */

/* Feature 9 - Number of recent products indicator */

/* Feature 10 - p50, p90 and p95 price value indicator */

/* Feature 11 - Last released date indicator */

/* Feature 12 - Open product link */

/* Feature 13 - Save as favorite */

/* Feature 14 - Filter by favorite */

/* Feature 15 - Usable and pleasant UX */
