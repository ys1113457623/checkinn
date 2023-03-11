import RoomModel from '@/models/RoomModel';
import nc from 'next-connect';
import connectDb from '../../../utils/connectDb';

connectDb();

const handler = nc()
  .get(async (req, res) => {
    try {
      const guest = await RoomModel.find({});
      res.send(guest);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting products');
    }
  })
  .post(async (req, res) => {
    const { roomNumber, roomType, price, amenities } = req.body;
    const room = new RoomModel({
      roomNumber,
      roomType,
      price,
      amenities,
    });

    try {
      await room.save();
      res.send('New Product Created');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating product');
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.query;
      await RoomModel.findByIdAndDelete(id);
      res.send('Product deleted');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting product');
    }
  });
// Connect to MongoDB

export default handler;
