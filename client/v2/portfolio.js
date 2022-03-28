// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// all brands
let brands = [];

// favorites
let favoriteSelectors = [];
let favoriteProducts;
if (localStorage.getItem('favoriteProducts') == null) {
	favoriteProducts = [];
}
else {
	favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts'));
}

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrandIndex = 0;
let reasonablePrice = -1;
let currentSort = 'asc';

// initiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');
const sectionFavorites = document.querySelector('#favorites');
const spanNbProducts = document.querySelector('#nbProducts');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const checkPrice = document.querySelector('#price-check');

/**
 * Get all brands
 */
const setAllLists = () => {
	brands = ["all"].concat(Array.from(new Set(currentProducts.map(product => {return product.brand;}))));
};

/**
 * Fetch products from api
 * @param  {Number}  [page = 1] - page
 * @param  {Number}  [size = 12] - size of the page
 * @param  {String}  [sort = 'asc'] - sort asc or desc
 * @param  {String}  [brand = 'all'] - brand filter
 * @param  {Number}  [price = 'all'] - price filter
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, sort = 'asc', brand = 'all', price = 'all') => {
	try {
		const response = await fetch(
			`https://jbr-clear-fashion-server.vercel.app/products/search?page=${page}&size=${size}&sort=${sort}&brand=${brand}&price=${price}`
		);
		const body = await response.json();

		currentPagination = {'currentPage' : body.currentPage, 'pageCount' : body.pageCount, 'pageSize' : body.pageSize, 'count' : body.count};
		currentProducts = body.result;
	} 
	catch (error) {
		console.error(error);
	}
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
	const fragment = document.createDocumentFragment();
	const div = document.createElement('div');
	let template = `
	<table>
		<thead>
			<tr>
				<th>Picture</th>
				<th>Name</th>
				<th>Brand</th>
				<th>Price</th>
				<th>Favorite</th>
			</tr>
		</thead>
		<tbody>`;
	products.map(product => {
		let fav = '';
		if (favoriteProducts.find((p) => p._id == product._id) != undefined) {
			fav = 'checked';
		}
		template += `
		<tr>
			<td><img src="${product.image}" width="150"></td>
			<td><a href="${product.url}" target="_blank">${product.name}</a></td>
			<td>${product.brand}</td>
			<td>${product.price}€</td>
			<td><input type="checkbox" id="check-${product._id}" ${fav}></td>
		</tr>`;
    });
	
	template += `
		</tbody>
	</table>`;

	div.innerHTML = template;
	fragment.appendChild(div);
	sectionProducts.innerHTML = '<h2>Products</h2>';
	sectionProducts.appendChild(fragment);
	
	favoriteSelectors.forEach(selector => {
		selector.removeEventListener('change', favEventListener);
		selector.parentElement.removeChild(selector);
	});
	favoriteSelectors = [];
	products.map(product => {
		const selector = document.querySelector(`#check-${product._id}`);
		selector.addEventListener('change', favEventListener);
		favoriteSelectors.push(selector);
	});
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount, pageSize, count} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render indicators
 * @param  {Object} products
 * @param  {Object} pagination
 */
const renderIndicators = (products, pagination) => {
	spanNbProducts.innerHTML = pagination.count;

	spanP50.innerHTML = String(products[Math.ceil(products.length*0.50)].price) + '€';
	spanP90.innerHTML = String(products[Math.ceil(products.length*0.90)].price) + '€';
	spanP95.innerHTML = String(products[Math.ceil(products.length*0.95)].price) + '€';
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

/**
 * Render favorite products
 * 
 */
 const renderFavorites = () => {
	const fragment = document.createDocumentFragment();
	const div = document.createElement('div');
	let template = `
	<table>
		<thead>
			<tr>
				<th>Picture</th>
				<th>Name</th>
				<th>Brand</th>
				<th>Price</th>
				<th>Favorite</th>
			</tr>
		</thead>
		<tbody>`;
	favoriteProducts.map(product => {
		template += `
		<tr>
			<td><img src="${product.image}" width="150"></td>
			<td><a href="${product.url}" target="_blank">${product.name}</a></td>
			<td>${product.brand}</td>
			<td>${product.price}€</td>
			<td><input type="checkbox" id="check-${product._id}-fav" checked></td>
		</tr>`;
    });

	template += `
		</tbody>
	</table>`;

	div.innerHTML = template;
	fragment.appendChild(div);
	sectionFavorites.innerHTML = '<h2>Favorite Products</h2>';
	sectionFavorites.appendChild(fragment); 

	favoriteProducts.map(product => {
		const selector = document.querySelector(`#check-${product._id}-fav`);
		selector.addEventListener('change', favEventListener);
		favoriteSelectors.push(selector);
	});
 };

/**
 * General rendering function
 * @param  {Object} products
 * @param  {Object} pagination
 */
const render = (products, pagination) => {
	renderProducts(products);
	renderPagination(pagination);
	renderBrands(currentBrandIndex);
	renderFavorites();
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', async event => {
	currentPagination.currentPage = 1;
	currentPagination.pageSize = parseInt(event.target.value);
	await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentSort, brands[currentBrandIndex], reasonablePrice);
	render(currentProducts, currentPagination);
});

/**
 * Select the page to display
 * @type {[type]}
 */
selectPage.addEventListener('change', async event => {
	currentPagination.currentPage = parseInt(event.target.value);
	await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentSort, brands[currentBrandIndex], reasonablePrice);
    render(currentProducts, currentPagination);
});

/**
 * Select the brand
 * @type {[type]}
 */
selectBrand.addEventListener('change', async event => {
	currentPagination.currentPage = 1;
	currentBrandIndex = event.target.selectedIndex;
	await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentSort, brands[currentBrandIndex], reasonablePrice);
    render(currentProducts, currentPagination);
});

/**
 * Filter by reasonable price (less than 50€)
 * @type {[type]}
 */
checkPrice.addEventListener('change', async event => {
	if (event.target.checked) reasonablePrice = 50;
	else reasonablePrice = -1;
	currentPagination.currentPage = 1;
	await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentSort, brands[currentBrandIndex], reasonablePrice);
    render(currentProducts, currentPagination);
});

/**
 * Select the sorting method
 * @type {[type]}
 */
selectSort.addEventListener('change', async event => {
	if (event.target.selectedIndex == 1) currentSort = 'desc';
	else currentSort = 'asc';
	currentPagination.currentPage = 1;
	await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentSort, brands[currentBrandIndex], reasonablePrice);
    render(currentProducts, currentPagination);
});

/**
 * Favorite event listener function
 * @type {Object}
 */
const favEventListener = (ev) => {
	if (ev.target.checked) {
		const _id = parseInt(ev.target.id.split('-').splice(1)[0]);
		const product = currentProducts.find((product) => product._id == _id);
		favoriteProducts.push(product);
	}
	else {
		const _id = parseInt(ev.target.id.split('-').splice(1)[0]);
		favoriteProducts.splice(favoriteProducts.indexOf(favoriteProducts.find((product) => product._id == _id)), 1);
	}
	localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
	render(currentProducts, currentPagination);
};

/**
 * On first load
 * @type {[type]}
 */
document.addEventListener('DOMContentLoaded', () => {
	fetchProducts()
		.then(() => {
			fetchProducts(1, currentPagination.count)
				.then(() => {
					setAllLists();
					renderIndicators(currentProducts, currentPagination);
				})
				.then(fetchProducts)
				.then(() => {
					render(currentProducts, currentPagination);
				});
		});
});
