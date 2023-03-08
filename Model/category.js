const mongoose=require('mongoose');
const { array } = require('../Middlewares/multer');

mongoose.set('strictQuery', false);

const categorySchema = new mongoose.Schema({
    category_name: { 
        type: String, 
        uppercase: true,
        require: true
    },
    produId: {
        type: Array,
    }
})

const category = mongoose.model('category', categorySchema);

module.exports = category;