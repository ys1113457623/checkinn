const mongose = require('mongoose');

async function connectDb(){
    try {
        const connection = await mongose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.log('MongoDB Connection Error: ' + error);
    }
}

module.exports = connectDb;
