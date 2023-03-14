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
let brandsCount = 0;
let favouriteList = [];

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbBrands = document.querySelector('#nbBrands');


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
const fetchProducts = async (page = 1, size = 12,ProductBrand='all') => {

  try {

    let url=`https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    if (ProductBrand !="all")
    {
        url+=`&brand=${ProductBrand}`;
    }
    const response = await fetch(url);
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



/*
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
  .map(product => {
    const isFav = favouriteList.includes(product.uuid);
    const favClass = isFav ? 'fav' : '';
    return `
    <div class="product ${favClass}" id=${product.uuid}>
      <span>${product.brand}</span>
      <a href="${product.link}"target="_blank">${product.name}</a>
      <span>${product.price}</span>
      <span>${product.released}</span>
      <button class="material-symbols-outlined fav-btn" onclick="fav('${product.uuid}')" title="Add to favourites">❤️</button>
    </div>
  `;
  })
  .join('');
*/
  /*
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}"target="_blank">${product.name}</a>
        <span>${product.price}</span>
        <span>${product.released}</span>
        <button class="material-symbols-outlined" onclick="fav('${product.uuid}')" title="Ajouter aux favoris">❤️</button>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};
*/


// save and load favourites

const saveFavourites = () => {
  localStorage.setItem('favourites', JSON.stringify(favouriteList));
};

const loadFavourites = () => {
  const savedFavourites = localStorage.getItem('favourites');
  if (savedFavourites) {
    favouriteList = JSON.parse(savedFavourites);
  } else {
    favouriteList = [];
  }
};

/**
 * Toggle favourite product
 * @param  {String} uuid - UUID of the product to add or remove from the favourite list
 */

/*
const toggleFavourite = uuid => {
  const index = favouriteList.findIndex(product => product.uuid === uuid);
  if (index === -1) {
    // product not in favourites, add it
    const product = currentProducts.find(product => product.uuid === uuid);
    favouriteList.push(product);
  } else {
    // product in favourites, remove it
    favouriteList.splice(index, 1);
  }
  console.log(favouriteList); // log the updated favourite list to the console

  // save the updated favourite list to local storage
  localStorage.setItem('favourites', JSON.stringify(favouriteList));
};
*/

// Call loadFavourites function once when the page is first loaded
loadFavourites();

const toggleFavourite = uuid => {
  const index = favouriteList.findIndex(product => product.uuid === uuid);
  if (index === -1) {
    // product not in favourites, add it
    const product = currentProducts.find(product => product.uuid === uuid);
    favouriteList.push(product);
  } else {
    // product in favourites, remove it
    favouriteList.splice(index, 1);
  }
  
  // Call saveFavourites function to save any changes to local storage
  saveFavourites();
  
  console.log(favouriteList); // log the updated favourite list to the console
};

// load the favourite list from local storage when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  setCurrentProducts(products);
  render(currentProducts, currentPagination);

  const favouritesFromStorage = localStorage.getItem('favourites');
  if (favouritesFromStorage) {
    favouriteList = JSON.parse(favouritesFromStorage);
  }
});


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}"target="_blank">${product.name}</a>
        <span>${product.price}</span>
        <span>${product.released}</span>
        <button class="material-symbols-outlined" onclick="toggleFavourite('${product.uuid}')"
          title="Ajouter aux favoris"
        >
          ❤️
        </button>
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

  const brands = [...new Set(currentProducts.map(product => product.brand))];
  const options = brands
    .map(brand => `<option value="${brand}">${brand}</option>`)
    .join('');

  selectBrand.innerHTML = `<option value="">All brands</option>${options}`;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrandsCount();
};

/**
 * Declaration of all Listeners
 */

//Feature 0 - Show more
//As a user
//I want to show more products
//So that I can display 12, 24 or 48 products on the same page
/**
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

  /*Feature 1 - Browse pages
As a user
I want to browse available pages
So that I can load more products */

selectPage.addEventListener('change', async (event) => {
  const page=parseInt(event.target.value)
  const products = await fetchProducts(page,parseInt(selectShow.value));
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/*Feature 2 - Filter by brands
As a user
I want to filter by brands name
So that I can browse product for a specific brand*/

const selectBrand = document.querySelector('#brand-select');

const filterProductsByBrand = brand => {
  const filteredProducts = currentProducts.filter(product => product.brand === brand);
  render(filteredProducts, {currentPage: 1, count: filteredProducts.length, pageCount: 1});
};

selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(selectPage.value), parseInt(selectShow.value), event.target.value);
  console.log(products);
  const res = products.result;


  setCurrentProducts(products);
  render(currentProducts, currentPagination);

});



/*

Feature 3 - Filter by recent products
As a user
I want to filter by by recent products
So that I can browse the new released products (less than 2 weeks)
*/

const selectRecent= document.querySelector('#recent-select');

selectRecent.addEventListener('change', async (event) => {
  const products = await fetchProducts(1,currentPagination.count);
  const today = new Date();
  const twoWeeksAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
  products.result = products.result.filter(product => {
    const date = new Date(product.released);
    return date > twoWeeksAgo;
  });

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
/*
Feature 4 - Filter by reasonable price
As a user
I want to filter by reasonable price
So that I can buy affordable product i.e less than 50€
*/

const selectReasonable= document.querySelector('#reasonable-select');

selectReasonable.addEventListener('change', async (event) => {
  const products = await fetchProducts(1,currentPagination.count);
  const max_price = 50;
  products.result = products.result.filter(product => {
    const price = new Date(product.price);
    return price <= max_price;
  });

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/*

Feature 5 - Sort by price
As a user
I want to sort by price
So that I can easily identify cheapest and expensive products

Feature 6 - Sort by date
As a user
I want to sort by price
So that I can easily identify recent and old products

*/

const sortProducts = (sortOption) => {
  let sortedProducts=[...currentProducts];

  switch(sortOption) {
    case 'price-asc':
      sortedProducts.sort((a,b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedProducts.sort((a,b) => b.price - a.price);
      break;
    
    case 'date-asc':
        sortedProducts.sort((a,b) => a.released - b.released);
       
        break;
      case 'date-desc':
        sortedProducts.sort((a,b) => b.released - a.released);
          break;
        default:
          break;
  }
  render(sortedProducts, {currentPage: 1, count: sortedProducts.length, pageCount: 1})
};

const selectSort=document.querySelector('#sort-select');


selectSort.addEventListener('change', async (event) => {
  const selectedSort = selectSort.value;
  sortedProduct=sortProducts(selectedSort);
  products.result=sortedProduct.result;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/*

Feature 8 - Number of products indicator
As a user
I want to indicate the total number of products
So that I can understand how many products is available
*/

function getNbBrands(brands)
{
  const brandsCount = 0;
  if(result.length > 0)
  {
    result.reduce((acc, product) => 
    // .reduce permet d'exécuter sur chaque valeur de la liste
    {
      if(!acc[product.brand]) 
      {
        acc[product.brand] = 1;
        brandsCount++;
      }
      return acc;
    });
  };
  return brandsCount;
}

const renderBrandsCount = () => {
  spanNbBrands.innerHTML = brandsCount;
};

/*
Feature 9 - Number of recent products indicator
As a user
I want to indicate the total number of recent products
So that I can understand how many new products are available
*/


const spanNbNewProducts = document.querySelector('#nbNewProducts');


function getRecentProducts(products){
  const today = new Date();
  const twoWeeksAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
  const recentProducts = products.filter(product => {
    const date = new Date(product.released);
    return date > twoWeeksAgo;
  });
  return recentProducts.length;
}

const renderNewProductsIndicator = async() => {
  const products = await fetchProducts(1,currentPagination.count);
  const recentProducts = getRecentProducts(products.result);
  spanNbNewProducts.innerHTML = recentProducts;
};



/*
Feature 10 - p50, p90 and p95 price value indicator
As a user
I want to indicate the p50, p90 and p95 price value
So that I can understand the price values of the products
*/
const spanp50Products = document.querySelector('#p50Products');
const spanp90Products = document.querySelector('#p90Products');
const spanp95Products = document.querySelector('#p95Products');

function getp50Value(products)
{
 
  const prices = products.map(product => product.price);
  prices.sort((a, b) => a - b);
  const p50Index = Math.ceil(prices.length * 0.5);
  const p50Value = prices[p50Index];
  return p50Value;
  }

function getp90Value(products){
  const prices = products.map(product => product.price);
  prices.sort((a, b) => a - b);
  const p90Index = Math.ceil(prices.length * 0.9);
  const p90Value = prices[p90Index];
  return p90Value;
  
}

function getp95Value(products){
  const prices = products.map(product => product.price);
  prices.sort((a, b) => a - b);
  const p95Index = Math.ceil(prices.length * 0.95);
  const p95Value = prices[p95Index];
  return p95Value;
}


const Percentiles = async() => {
  const products = await fetchProducts(1,currentPagination.count);
  const p50 = getp50Value(products.result);
  spanp50Products.innerHTML = p50;
  const p90 = getp90Value(products.result);
  spanp90Products.innerHTML = p90;
  const p95 = getp95Value(products.result);
  spanp95Products.innerHTML = p95;
};


window.addEventListener('load', Percentiles);

/*
Feature 11 - Last released date indicator
As a user
I want to indicate the last released date
So that I can understand if we have new products
*/

const spanLastReleased = document.querySelector('#last-released');

function last_released(products){
  const dates = products.map(product => product.released);
  dates.sort((a,b) => a.released - b.released);
  return dates[0];
}

const renderLastReleased = async() => {
  const products = await fetchProducts(1,currentPagination.count);
  const last= last_released(products.result);
  spanLastReleased.innerHTML = last;
 
};

window.addEventListener('load', renderLastReleased);



/*
Feature 12 - Open product link
As a user
I want to open product link in a new page
So that I can buy the product easily

DONE

*/

/*
Feature 13 - Save as favorite
As a user
I want to save a product as favorite
So that I can retreive this product later
*/

/*

function addToFavorite(product) {
  var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(product);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  document.getElementById(product + "-fav").innerHTML = `❤️ <button onclick=deleteToFavorite("` + product + `")>Delete from favorite</button>`;
}

async function deleteToFavorite(product) {
  var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(favorite => favorite != product);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  document.getElementById(product + "-fav").innerHTML = `<button onclick=addToFavorite("` + product + `")>Add to favorite</button>`;
  if(showOnlySelectFavorite.checked){
    const products = await fetchProducts(1, currentPagination.pageSize, selectBrand.value, sortSelect.value, [showOnlySelectSale.checked, showOnlySelectNew.checked, showOnlySelectFavorite.checked]);
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
}

*/

/*
function fav(products) {
  for(var i = 0; i < currentProducts.length; ++i){
    if((currentProducts[i].uuid).toString()===products && favproducts.includes(currentProducts[i])=== false){
      favproducts.push(currentProducts[i]);
      var popup = document.createElement("div");
      popup.className = "popup";
      popup.innerHTML = "Added to favorites";
      document.body.appendChild(popup);
      setTimeout(function() {document.body.removeChild(popup)}, 2000);
    }
  }
  return favproducts;
}

function displayfav(){
  render(favproducts,currentPagination);
}
*/

/*
function fav(products) {
  for(var i = 0; i < currentProducts.length; ++i){
    if((currentProducts[i].uuid).toString()===products && favouriteList.includes(currentProducts[i])=== false){
      favouriteList.push(currentProducts[i]);
    }
  }
  return favouriteList;
}

function displayfav()
{
  render(favouriteList,currentPagination);
}
*/

/*
Feature 14 - Filter by favorite
As a user
I want to filter by favorite products
So that I can load only my favorite products
*/



/*
Feature 15 - Usable and pleasant UX
As a user
I want to parse a usable and pleasant web page
So that I can find valuable and useful content*/


