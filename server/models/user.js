const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email : {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate : {
      validator: validator.isEmail,
      message: "Value is not a valid email",
      isAsync: true
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});


// Model methods and Instance methods can be defined on Mongoose UserSchema

// Instance method on the document which uses UserSchema
UserSchema.methods.generatAuthToken = function () {
  // used regular function as arrow function does not bind 'this' variable
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens.push({access, token});

  // can return anything from the promise call back.. will be available to the next then()
  return user.save().then(() => {
    // returning token directly would also make it available for the promise chain
    // However this way it will be available only when save() is successfull
    return token;
  });
}

// Override an existing Instance method
// Determines what exactly gets send back when a mongoose model is converted to JSON value
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject(); // taking mongoose object to a regular object where only the document fields exist
  return _.pick(userObject, ['_id', 'email']);
}


UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull : { // define we want to pull from the user model

      tokens: { // from the tokens array
        // any object named token which matches the value token
        token // token: token
      }
    }
  })
}


// Model method
UserSchema.statics.findByToken = function (token) {
  var User = this;  // corresponds to model not the document
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // })
    return Promise.reject(); // code has same effect as code above
  }

  return User.findOne({
    _id : decoded._id,
    'tokens.token': token, // need quotes when there is a dot in the variable
    'tokens.access' : 'auth'
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({email}).then ((user)=>{
    if (!user) {
      return Promise.reject(404);
    }

    // since bcrypt.compare does not return a Promise.. enclose with a Promise
    return new Promise( (resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        }
        else {
          reject(401);
        }
      });
    });
  });
}

// Mongoose allows middleware methods to be added based on certain events
// Define a middleware to run before UserSchema document is saved: 'pre' 'save'
UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User};
