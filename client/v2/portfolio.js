// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// number of products
let productsCount = 0;

// all products
let products = [];

// all brands
let brands = [];

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrandIndex = 0;
let recentlyReleased = false;
let reasonablePrice = false;

// initiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const checkReleased = document.querySelector('#released-check');
const checkPrice = document.querySelector('#price-check');

/**
 * Set global value
 * @param {Number} size - number of products per page
 */
const setCurrentProducts = (size) => {
	const page = currentPagination.currentPage;
	let temp;
	if (recentlyReleased) {
		temp = products.filter(product => {
			const rel = new Date(product.released);
			const today = new Date();
			return (today - rel)/(1000*60*60*24) < 14.0;
		});
	}
	else {
		temp = products;
	}
	
	if (reasonablePrice) {
		temp = temp.filter(product => {
			return product.price < 50;
		});
	}
	
	if (currentBrandIndex != 0) {
		temp = temp.filter(product => {
			return product.brand == brands[currentBrandIndex];
		});
	}
	currentPagination.pageCount = Math.ceil(temp.length/currentPagination.pageSize);
	currentProducts = temp.slice((page-1)*size, page*size);;
};

/**
 * Get all the products and brands
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setAllLists = ({result, meta}) => {
	products = result;
	brands = ["N/A"].concat(Array.from(new Set(result.map(product => {return product.brand;}))));
};

/**
 * Fetch products from api
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (size = 12) => {
	try {
		const response = await fetch(
			`https://clear-fashion-api.vercel.app?size=${size}`
		);
		const body = await response.json();

		if (body.success !== true) {
			console.error(body);
			return {currentProducts, currentPagination};
		}

		return body.data;
	} 
	catch (error) {
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
  const template = products
    .map(product => {
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
  const {productsCount} = pagination;

  spanNbProducts.innerHTML = productsCount;
};

/**
 * Render brand selector
 * @param  {Object} brands
 */
const renderBrands = (currentBrandIndex) => {
	let options = '';
	brands.map(brand => {
		options += `<option value="${brand}">${brand}</option>`;
	});
	
	selectBrand.innerHTML = options;
	selectBrand.selectedIndex = currentBrandIndex;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(currentBrandIndex);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
	currentPagination.currentPage = 1;
	currentPagination.pageSize = parseInt(event.target.value);
	setCurrentProducts(parseInt(event.target.value));
	render(currentProducts, currentPagination);
});

/**
 * Select the page to display
 * @type {[type]}
 */
selectPage.addEventListener('change', event => {
	currentPagination.currentPage = parseInt(event.target.value);
	setCurrentProducts(currentPagination.pageSize);
    render(currentProducts, currentPagination);
});

/**
 * Select the brand
 * @type {[type]}
 */
selectBrand.addEventListener('change', event => {
	currentPagination.currentPage = 1;
	currentBrandIndex = event.target.selectedIndex;
	setCurrentProducts(currentPagination.pageSize);
    render(currentProducts, currentPagination);
});

/**
 * Filter by recently released (less than 2 weeks)
 * @type {[type]}
 */
checkReleased.addEventListener('change', event => {
	recentlyReleased = event.target.checked;
	currentPagination.currentPage = 1;
	setCurrentProducts(currentPagination.pageSize);
    render(currentProducts, currentPagination);
});

/**
 * Filter by reasonable price (less than 50€)
 * @type {[type]}
 */
checkPrice.addEventListener('change', event => {
	reasonablePrice = event.target.checked;
	currentPagination.currentPage = 1;
	setCurrentProducts(currentPagination.pageSize);
    render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', () => {
	fetchProducts()
		.then(({result, meta}) => {productsCount = meta.count;})
		.then(() => {
			fetchProducts(productsCount)
				.then(setAllLists)
				.then(() => {
					currentPagination = {"currentPage":1, "pageCount":Math.ceil(productsCount/12), "pageSize":12};
					setCurrentProducts(12);
					render(currentProducts, currentPagination);
				});
		});
});
