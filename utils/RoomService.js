const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export class RoomService {
  getRooms = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/rooms/`);
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
