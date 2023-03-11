const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  roomType: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Triple', 'Suite'],
  },
  price: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
  amenities: {
    type: [String],
    default: [],
  },
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
  ],
});

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);
