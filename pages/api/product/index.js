import nc from 'next-connect';
import ProductModel from '../../../models/ProductModel';
import connectDb from '../../../utils/connectDb';

connectDb();

const handler = nc()
  .get(async (req, res) => {
    try {
      const guest = await ProductModel.find({});
      res.send(guest);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting products');
    }
  })
  .post(async (req, res) => {
    const {
      id,
      first_name,
      last_name,
      phone_number,
      address,
      country,
      city,
      pincode,
    } = req.body;
    const guest = await ProductModel.create({
      id,
      first_name,
      last_name,
      phone_number,
      address,
      country,
      city,
      pincode,
    });
    // {"id":"4eUF4","first_name":"124124","last_name":"231412","phone_number":"24124121","address":"afafas1","country":"","city":"24124","pincode":null,"zip":"124124"}
    try {
      await guest.save();
      res.send('New Product Created');
    } catch {
      console.error(error);
      res.status(500).send('Error creating product');
    }
  });

export default handler;
