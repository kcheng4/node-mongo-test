// MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

//var obj = new ObjectID();
//console.log(obj);

var user = {name:'Koopers',age:55};
var {name} = user;
console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err, client) => {
  if(err){
    return console.log('Unable to connect to Database server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  /*db.collection('Todos').insertOne({
    text: 'Soup Dumplings',
    completed: true
  },(err, res) => {
    if (err){
      return console.log("Unable to insert todo",err);
    }
    console.log(JSON.stringify(res.ops, undefined,2));
  })*/
  db.collection('Users').insertOne({
    name:'Kvde',
    age:23,
    location: 'Philadelphia'
  },(err,res) => {
    if (err){
      return console.log("Unable to insert user",err);
    }

    console.log('User added to database\n',res.ops[0]._id.getTimestamp());
  });

  client.close();
});
