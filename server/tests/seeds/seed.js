const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');
const jwt = require('jsonwebtoken');

const user1ID = new ObjectID();
const user2ID = new ObjectID();

const users = [{
  _id: user1ID,
  email: 'Goota@gmail.com',
  password: 'Meetch',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:user1ID,access:'auth'},'secret').toString()
  }];
},{
  _id: user2ID,
  email: 'Eaterres@gmail.com',
  password: 'Hatorade'
}];

const todos = [{
  _id:new ObjectID(),
  text:"Test 1",
  _creator:user1ID
}, {
  _id:new ObjectID(),
  text:"Test 2",
  completed:true,
  completedAt: 333,
  _creator:user2ID
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => {
    done();
  })
};

const populateUsers = (done)=>{
  User.remove({}).then(() => {
    var user1 = new User(user[0]).save();
    var user2 = new User(user[1]).save();

    return Promise.all([user1,user2]);
  }).then(() => {
    done();
  });
}

module.exports = {todos, populateTodos, users, populateUsers};
