const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email:{
    required:true,
    trim:true,
    type:String,
    minlength:1,
    unique:true,
    validate:{
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type:String,
    required:true,
    minlength:6
  },
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }
  }]
});

UserSchema.methods.toJSON = function (){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject,['_id','email']);
}
UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id:user._id.toHexString(), access},'secret').toString();

  user.tokens = user.tokens.concat([{access,token}]);
  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  var user = this;
  var decoded;
  try{
    decoded = jwt.verify(token,'secret');
  }
  catch(e){
    return Promise.reject('User not Authorized.');
  }
  return User.findOne({
    _id: decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });
};

var User = mongoose.model('Users',UserSchema);

module.exports = {User};
