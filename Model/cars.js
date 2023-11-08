const mongoose = require('mongoose');
const path = require('path');

mongoose.set('strictQuery', false);

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image:[{
        path:{
            type:String
        }
    }],
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ticketrate: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "category"
    },
    deleted: Boolean,
    ticket : {
        type: Number,
    }
})



const cars = mongoose.model('car', carSchema);

module.exports = cars;