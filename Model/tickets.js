const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const ticketSchema = new mongoose.Schema({
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
        quantity:Number,
        payable: Number,
        paid: Number,
    }],
    total: Number
});

const ticket = mongoose.model('ticket', ticketSchema);

module.exports = ticket;