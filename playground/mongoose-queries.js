const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {UserModel} = require('./../server/models/users');

var id = '5bdb865b7ee8b038b408ab8d';

// if (ObjectID.isValid(id)){
//   console.log('ID not valid');
// }

//
// Todo.find({
//   _id:id
// }).then((res) => {
//   console.log(res);
// });
//
// Todo.findOne({
//   _id:id
// }).then((res) => {
//   console.log(res);
// });

// Todo.findById(id).then((res) => {
//   if (!res){
//     return console.log('ID not found');
//   }
//   console.log(res);
// }).catch((err) => {
//   return console.log(err);
// });

UserModel.findById(id).then((res) => {
  if (!res){
    return console.log('User not found');
  }
  console.log(res);
}).catch((err) => {
  return console.log(err);
});
