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



  // db.collection('Todos').findOneAndUpdate({
  //   _id:new ObjectID("5bda2ea82d7c08a6f8621a54")
  // },{
  //   $set:{completed:true}
  // },{
  //   returnOriginal:false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id:new ObjectID("5bd798fb695935bcb886b3e6")
  },{
    $set:{name:'Kutcher Prime'},
    $inc:{age:1}
  },{
    returnOriginal:true
  }).then((res) => {
    console.log(res);
  });

  client.close();
});
