// MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

//var obj = new ObjectID();
//console.log(obj);


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
  /*db.collection('Todos').deleteOne({text:'Riperoni Pepperoni'}).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });*/

  db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
    console.log(result);
  })

  client.close();
});
