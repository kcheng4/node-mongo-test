const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {UserModel} = require('./../server/models/users');

Todo.deleteOne({_id:new ObjectID('5bea1cbf9345b3bfb0a35385')}).then((res) => {
  console.log(res);
});
