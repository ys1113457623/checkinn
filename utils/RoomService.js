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
      const response = await fetch('http://localhost:3000/api/rooms/');
      const json = await response.json();

      return json;
    } catch (e) {
      console.log(e);
    }
  };
  bookRoom = async (
    roomId,
    guestName,
    guestEmail,
    checkInDate,
    checkOutDate,
    numGuests
  ) => {
    const booking = {
      roomId,
      guestName,
      guestEmail,
      checkInDate,
      checkOutDate,
      numGuests,
      status: 'booked',
    };

    try {
      const response = await axios.post('/bookings', booking);
      const updatedRoom = response.data.room;

      // Update the state of your React component to reflect the change
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id === updatedRoom.id) {
            return updatedRoom;
          }
          return room;
        })
      );
    } catch (error) {
      console.error(error);
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
