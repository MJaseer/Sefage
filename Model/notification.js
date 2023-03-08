const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    carId: [{
        carId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "car",
        },
        orderId:{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "order",
        },
        quantity:Number,
        payable: Number,
        paid: Number,
        time:{
            type:Date,
            default:Date.now()
        },
        discount: {
            type:Number,
            default: 0
        },
        status:{
            type:Boolean,
            default:true
        }
    }],
});

const note = mongoose.model('note', noteSchema);

module.exports = note;
