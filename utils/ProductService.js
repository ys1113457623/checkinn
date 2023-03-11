import getConfig from 'next/config';

export class ProductService {
  constructor() {
    this.contextPath = getConfig().publicRuntimeConfig.contextPath;
  }

  getProductsSmall() {
    return fetch(this.contextPath + '/demo/data/products-small.json', {
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => res.json())
      .then((d) => d.data);
  }

  getProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/product/');
      const json = await response.json();

      return json;
    } catch (e) {
      console.log(e);
    }
  };

  getProductsWithOrdersSmall() {
    return fetch(this.contextPath + '/demo/data/products-orders-small.json', {
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => res.json())
      .then((d) => d.data);
  }
}
