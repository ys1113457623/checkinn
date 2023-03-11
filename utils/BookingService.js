import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export class BookingService {
  getBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/booking`);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };
  
  createBooking = async (bookingData) => {
    try {
      const res = await axios.post(`${API_URL}/booking`, bookingData);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };
  getBookingById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/booking/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };
  deleteBooking = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/booking/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
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
