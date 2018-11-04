const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoList',{useNewUrlParser:true});

var Test = mongoose.model('Test',{
  text: {
    type: String,
    required:true,
    minlength:1,
    trim:true
  },
  completed: {
    type: Boolean,
    default:false
  },
  completedAt: {
    type: Number,
    default:null
  }
});

var test = new Test({text:"test"});
test.save().then((res) => {
  console.log(res);
}).catch((err) => {
  console.log(err);
});
