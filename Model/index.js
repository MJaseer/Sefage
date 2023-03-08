const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const homeSchema = new mongoose.Schema({
    bannerImage: {
        type: Array,
    },
    bannerHead: {
        type: String    
    },
    bannerSubHead: {
        type: String    
    },
    bannerDetils: {
        type: String    
    }
})

const home = mongoose.model('home', homeSchema);

module.exports = home;