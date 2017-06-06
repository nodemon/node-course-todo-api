const {SHA256} = require('crypto-js');

var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

// Token will be passed back and forth .. containing the data and its hash
// JWT Json Web Token

var data = {
  id : 4
};
var token = {
  data,
  // 'salt' the hash to prevent man in the middle
  hash : SHA256(JSON.stringify(data) + 'somesecret').toString()
}

// man in the middle
token.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();


var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if (resultHash === token.hash) {
  console.log('Data was not changed');
} else {
  console.log('Data was changed. Do not trust!');
}
