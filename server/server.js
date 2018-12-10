var env = process.env.NODE_ENV || 'development';
console.log( env);
if (env == 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI='mongodb://localhost:27017/TodoList';

}
else if (env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI='mongodb://localhost:27017/TodoApp';
}

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

app.post('/todos',(req,res) => {
    console.log(req.body);
    var todo = new Todo({
      text:req.body.text
    });

    todo.save().then((resp) => {
      res.send(resp);
    }).catch((e) => {
      res.status(400).send(e);
    })
});

app.get('/todos',(req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }).catch((err) => {
    res.status(400).send(err);
  })
});

app.get('/todos/:id',(req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('Not a valid ID');
  }
  else {
    Todo.findById(id).then((resp) => {
      if (!resp) {
        return res.status(404).send();
      }
      res.send({resp});
    }).catch((err) => {
      res.status(400).send(err);
    })
  }
});

app.delete('/todos/:id',(req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('Not a valid ID');
  }
  else {
    Todo.deleteOne({_id:new ObjectID(id)}).then((resp) => {
      if (!resp) {
        return res.status(404).send();
      }
      res.send({resp});
    }).catch((err) => {
      res.status(400).send();
    });
  }
});

app.patch('/todos/:id',(req,res) => {
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
    Todo.updateOne({_id:id},{$set:body},{new:true}).then((resp) => {
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

app.post('/users',(req,res) => {
    console.log(req.body);
    var data = _.pick(req.body,["email","password"]);
    var user = new User(data);

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth',token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
});


app.get('/users/me', authenticate,(req,res) => {
  console.log(req.user);
  res.send(req.user);
});

app.post('/users/login',(req,res) => {
    var data = _.pick(req.body,["email","password"]);

    User.findByCredentials(data.email,data.password).then((user) => {
      user.generateAuthToken().then((token) => {
        res.header('x-auth',token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req,res) => {
    req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    },() => {
      res.status(400).send();
    });
});

app.listen(port,() => {
  console.log(`Started on port ${port}`);
})

module.exports = {app};
