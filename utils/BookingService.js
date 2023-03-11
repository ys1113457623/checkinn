import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create a booking
export const createBooking = async (bookingData) => {
  try {
    const res = await axios.post(`${API_URL}/booking`, bookingData);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Get all booking
export const getBookings = async () => {
  try {
    const res = await axios.get(`${API_URL}/booking`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Get a booking by ID
export const getBookingById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/booking/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Update a booking
export const updateBooking = async (id, bookingData) => {
  try {
    const res = await axios.put(`${API_URL}/booking/${id}`, bookingData);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Delete a booking
export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/booking/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
