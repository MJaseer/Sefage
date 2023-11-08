const mongoose=require('mongoose');
const { array } = require('../Middlewares/multer');

mongoose.set('strictQuery', false);

const locationSchema = new mongoose.Schema({
    locations: { 
        type: Object, 
        require: true
    },
})

const location = mongoose.model('locations', locationSchema);

module.exports = location;