const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

// use www.jwt.io to view tokens

var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded ', decoded);