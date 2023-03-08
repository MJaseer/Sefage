const mongoose=require('mongoose');
const { array } = require('../Middlewares/multer');

mongoose.set('strictQuery', false);

const wishSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.SchemaTypes.ObjectId, 
        ref:"User"
    },
    carId: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "car"
    }]
})

const wish = mongoose.model('wishlists', wishSchema);

module.exports = wish;
