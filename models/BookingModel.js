const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const productSchema = new Schema({


    room_id:{
        type: String,
        required: true,
    },
    room_number:{
        type: String,
        required: true,
    },
    guest_name:{
        type: String,
        required: true,
    },
    guest_email:{
        type: String,
        required: true,
    },
    guest_phone:{
        type: String,
        required: true,
    },
    number_of_guests:{
        type: Number,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    },
    phone_number:{
        type: Number,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    pincode:{
        type: Number,
        required: true,
    },






});

productSchema.set('timestamp', true)


module.exports = mongoose.models.Guests || mongoose.model('Guests', productSchema);
