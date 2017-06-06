// jwt is used to generate hash and verify hashed data
// use www.jwt.io to view tokens
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded ', decoded);



// brypt JS; has salting built in
 // - salt is actually stored in the string before the hash value.
const bcrypt = require('bcryptjs');

var password = '123abc!';


bcrypt.genSalt(10, (err, salt) => { // generates a salt randomly 10 rounds
  bcrypt.hash(password, salt, (err, hash) => { // use the salt to generate hash
    console.log(hash);
  } )
});

// This string has both salt and hash
var hashedPassword = '$2a$10$jY1WL5u4rvDLz9mkaaMzlOeX8mhVUrr82v6PLZmVCbzN4PC93DDm2';

/*
'$2a$10$ - algorithm and the number of rounds to use
 jY1WL5u4rvDLz9mkaaMzlO 22 character salt stored inline, so it doesnt need to be stored as a separate database field
 eX8mhVUrr82v6PLZmVCbzN4PC93DDm2 31 character hash of the password (using the above salt).
*/

bcrypt.compare('123abc!', hashedPassword, (err, res) => {
  console.log(res);
})
