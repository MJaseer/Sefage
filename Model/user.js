
const mongoose=require('mongoose');
const { array } = require('../Middlewares/multer');

mongoose.set('strictQuery', false)


const userSchema = new mongoose.Schema({
  
  email: {
    type:String,
    require: true, unique: true 
  },
  password:String,
  fname:String,
  lname:String,
  cities:String,
  state:String,
  cpassword:String,
  flats:String,
  status:String,
  delete:{
    type:Boolean,
    default:false
  },
  phone:Number,
});

const User = mongoose.model('User', userSchema);
module.exports=User;