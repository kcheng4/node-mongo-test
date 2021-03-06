// var env = process.env.NODE_ENV || 'development';
// console.log( env);
// if (env == 'development'){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI='mongodb://localhost:27017/TodoList';
//
// }
// else if (env === 'test'){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI='mongodb://localhost:27017/TodoApp';
// }
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req,res) => {
    console.log(req.body);
    var todo = new Todo({
      text:req.body.text,
      _creator:req.user._id
    });

    todo.save().then((resp) => {
      res.send(resp);
    }).catch((e) => {
      res.status(400).send(e);
    })
});

app.get('/todos', authenticate, (req,res) => {
  Todo.find({_creator:req.user._id}).then((todos) => {
    res.send({todos});
  }).catch((err) => {
    res.status(400).send(err);
  })
});

app.get('/todos/:id', authenticate, (req,res) => {
  var id = req.params.id;
  console.log(id);
  console.log(req.user._id);
  if (!ObjectID.isValid(id)){
    return res.status(404).send('Not a valid ID');
  }
  else {
    Todo.findOne({_id:id,_creator:req.user._id}).then((resp) => {
      if (!resp) {
        return res.status(404).send();
      }
      res.send({resp});
    }).catch((err) => {
      res.status(400).send(err);
    })
  }
});

app.delete('/todos/:id', authenticate, async (req,res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('Not a valid ID');
  }
  else {
    try{
      const resp = await Todo.deleteOne({_id:new ObjectID(id),_creator:req.user._id});
      if (!resp) {
        return res.status(404).send();
      }
      res.send({resp});
    }
    catche (e){
      res.status(400).send();
    }
    // Todo.deleteOne({_id:new ObjectID(id),_creator:req.user._id}).then((resp) => {
    //   if (!resp) {
    //     return res.status(404).send();
    //   }
    //   res.send({resp});
    // }).catch((err) => {
    //   res.status(400).send();
    // });
  }
});

app.patch('/todos/:id', authenticate, (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if (!ObjectID.isValid(id)){
    return res.status(404).send('Not a valid ID');
  }
  else {
    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    }
    else {
      body.completed = false;
      body.completedAt = null;
    }
    Todo.updateOne({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((resp) => {
        if(!resp){
          return res.status(400).send();
        }
        console.log(resp);
        res.send({resp});
    }).catch((err) => {
      res.status(400).send();
    });
  }
});

app.post('/users', async (req,res) => {
  try{
    console.log(req.body);
    const data = _.pick(req.body,["email","password"]);
    const user = new User(data);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth',token).send(user);
  }
  catch(e){
    res.status(400).send(e);
  }

  // user.save().then(() => {
  //   return user.generateAuthToken();
  // }).then((token) => {
  //   res.header('x-auth',token).send(user);
  // }).catch((e) => {
  //   res.status(400).send(e);
  // });
});


app.get('/users/me', authenticate,(req,res) => {
  console.log(req.user);
  res.send(req.user);
});

app.post('/users/login', async (req,res) => {
    try{
      const data = _.pick(req.body,["email","password"]);
      const user = await User.findByCredentials(data.email,data.password);
      const token = await user.generateAuthToken();
      res.header('x-auth',token).send(user);
    }
    catch(e){
      res.status(400).send();
    }

    // User.findByCredentials(data.email,data.password).then((user) => {
    //   user.generateAuthToken().then((token) => {
    //     res.header('x-auth',token).send(user);
    //   });
    // }).catch((e) => {
    //   res.status(400).send();
    // });
});

app.delete('/users/me/token', authenticate, async (req,res) => {
  //Async-awake-ify
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  }
  catch (e) {
    res.status(400).send();
  }

  // req.user.removeToken(req.token).then((test) => {
  //   console.log('User object from token delete: '+JSON.stringify(test));
  //   res.status(200).send();
  // },() => {
  //   res.status(400).send();
  // });
});

app.listen(port,() => {
  console.log(`Started on port ${port}`);
})

module.exports = {app};
