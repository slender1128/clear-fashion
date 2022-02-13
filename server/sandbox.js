/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');

async function sandbox () {
  try {
    let all_products = [];
    const dedicatedbrand_url = 'https://www.dedicatedbrand.com/en/men/all-men';

    let page = 1;
    let products = [];

    do
    {
      console.log(`🕵️‍♀️  browsing ${dedicatedbrand_url+`?p=${page}`} source`);
      products = await dedicatedbrand.scrape(dedicatedbrand_url+`?p=${page}`);
      console.log('done');
      if (products.length != 0) products.forEach(product => all_products.push(product));
      page++;
    }
    while (products.length != 0);
    console.log(all_products);
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

sandbox();