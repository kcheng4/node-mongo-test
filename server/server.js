const express = require('express');
const bodyParser = require('body-parser');


const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todo');
const {UserModel} = require('./models/users');

var app = express();
const port = process.env.PORT || 3000;

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
})

app.listen(port,() => {
  console.log(`Started on port ${port}`);
})

module.exports = {app};
