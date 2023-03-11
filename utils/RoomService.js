export class RoomService {
  //   constructor() {
  //     this.contextPath = getConfig().publicRuntimeConfig.contextPath;
  //   }

  //   getProductsSmall() {
  //     return fetch(this.contextPath + '/demo/data/products-small.json', {
  //       headers: { 'Cache-Control': 'no-cache' },
  //     })
  //       .then((res) => res.json())
  //       .then((d) => d.data);
  //   }

  getRooms = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/rooms/');
      const json = await response.json();

      return json;
    } catch (e) {
      console.log(e);
    }
  };

  //   getProductsWithOrdersSmall() {
  //     return fetch(this.contextPath + '/demo/data/products-orders-small.json', {
  //       headers: { 'Cache-Control': 'no-cache' },
  //     })
  //       .then((res) => res.json())
  //       .then((d) => d.data);
  //   }
}
