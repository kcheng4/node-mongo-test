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

  db.collection('Users').find().count().then((docs) => {
    console.log('Todos:/n');
    console.log(JSON.stringify(docs,undefined,2));
  }).catch((err) => {
    console.log('Unable to fetch todos', err);
  });

  //client.close();
});
