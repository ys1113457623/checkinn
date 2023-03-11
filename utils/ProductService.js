const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export class ProductService {
  constructor() {}

  getProductsSmall() {
    return fetch('/demo/data/products-small.json', {
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => res.json())
      .then((d) => d.data);
  }

  getProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/product/`);
      const json = await response.json();

      return json;
    } catch (e) {
      console.log(e);
    }
  };

  getProductsWithOrdersSmall() {
    return fetch('/demo/data/products-orders-small.json', {
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => res.json())
      .then((d) => d.data);
  }
}
