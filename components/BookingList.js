import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
} from '@/utils/BookingService';
import { useEffect, useState } from 'react';

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      const bookingsData = await getBookings();
      setBookings(bookingsData);
    }

    fetchBookings();
  }, []);

  async function handleCreateBooking(newBookingData) {
    const newBooking = await createBooking(newBookingData);
    setBookings([...bookings, newBooking]);
  }

  async function handleUpdateBooking(id, updatedBookingData) {
    const updatedBooking = await updateBooking(id, updatedBookingData);
    const updatedBookings = bookings.map((booking) =>
      booking._id === id ? updatedBooking : booking
    );
    setBookings(updatedBookings);
  }

  async function handleDeleteBooking(id) {
    await deleteBooking(id);
    const updatedBookings = bookings.filter((booking) => booking._id !== id);
    setBookings(updatedBookings);
  }
  //return a div give booking.map as a function

  return (
    <div>
      {bookings.map((booking) => {
        return <div key={booking._id}>{booking.checkIn}</div>;
      })}
    </div>
  );
}
