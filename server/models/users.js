const mongoose = require('mongoose');

var UserModel = mongoose.model('Users',{
  email:{
    required:true,
    trim:true,
    type:String,
    minlength:1
  }

});

module.exports = {UserModel};
