import BookingModel from '@/models/BookingModel';
import nc from 'next-connect';
import connectDb from '../../../utils/connectDb';

connectDb();

const handler = nc();

handler.get(async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate({
        path: 'user',
        model: 'Guests',
      })
      .populate({
        path: 'room',
        model: 'Room',
      });
    console.log(JSON.stringify(bookings));
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

handler.post(async (req, res) => {
  try {
    const { user, room, checkIn, checkOut, totalPrice } = req.body;
    const booking = new BookingModel({
      user,
      room,
      checkIn,
      checkOut,
      totalPrice,
    });
    await booking.save();
    res.send('New Booking Created');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = handler;
