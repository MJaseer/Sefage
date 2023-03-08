const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;