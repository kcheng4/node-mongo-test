const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id:14
};

var token = jwt.sign(data,"hoopsballa");
console.log(token);

var decode = jwt.verify(token,"hoopsballa");
console.log(decode);
// var message = "I'm coojoe";
// var hash = SHA256(message).toString();
// console.log(message);
// console.log(hash);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+"secret").toString()
// };
//
// token.data.id=5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data)+"secret").toString();
// console.log("1:"+resultHash);
// console.log("2:"+token.hash);
// if(resultHash === token.hash){
//   console.log('Data was not changed');
// }
// else {
//   console.log('Data was changed');
// }
