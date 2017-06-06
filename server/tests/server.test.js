/*
  done is a callback that needs to be invoked to end the async test case
  end() is supertest method that expects a callback which it invokes at the end of all assertions
  This implies that
  .end(done) will implicitly call done() after all assestions marking the end of test case

  For doing other things inside of end: pass a custom function
  end ( (err, res) => {
    if (err)
      done(err);  // fail
    done();   // success
  })

*/

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {testTodos, populateTodos, testUsers, populateUsers} = require('./seed/seed');


// runs before each test.. populating Seed data
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post ('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end( (err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done (e));

      })
  })

  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post ('/todos')
      .send({})
      .expect(400)
      .end( (err, res) => {
        if (err) {
          return done (err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done (e));

      })
  });
})

describe('GET /todos', () => {
  it ('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect( (res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  })
})

describe ('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${testTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect ( (res) => {
        expect(res.body.todo.text).toBe(testTodos[0].text);
      })
      .end(done);
  });

  it ('should return 404 it todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request (app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it ('should return 400 for non-objectId', (done) => {
    request (app)
      .get(`/todos/abc123`)
      .expect(400)
      .end(done);
  });

})

describe ('DELETE /todos/:id', () => {

  var id = testTodos[1]._id.toHexString();

  it ('should remove a todo', (done) => {
    request (app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect ( (res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end( (err, res) => {
        if (err) {
          return done (err);
        }

        Todo.findById(id).then( (todo)=> {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done (e))
      })

  });

  it ('should return 404 if todo is not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request (app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  });

  it ('should return 400 if id is invalid', (done) => {
    request (app)
      .delete(`/todos/123asdf`)
      .expect(400)
      .end(done)

  });

})

describe('PATCH /todos/:id', () => {
  var id = testTodos[0]._id.toHexString();
  var updatedText = 'This is Updated Text';

  it('should update the todo', (done) => {
    request(app)
      .patch(`/todos/${id}`)
      .send({text: updatedText, completed: true})
      .expect(200)
      .expect ( (res) => {
        expect(res.body.todo.text).toBe(updatedText);
        expect(res.body.todo.completed).toExist();
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end ( (err, res) => {
        if (err) {
          return done (err);
        }
        Todo.findById(id).then ((todo) => {
          expect(todo.text).toBe(updatedText);
          expect(todo.completed).toExist(); // true
          expect(todo.completedAt).toBeA('number');
          done();
        }).catch ((e) => done(e));
      })

  });

  it('should clear completedAt when todo is not complete', (done) => {
    request(app)
      .patch(`/todos/${id}`)
      .send({completed: false})
      .expect(200)
      .expect ( (res) => {
        expect(res.body.todo.completed).toNotExist(); // false`
        expect(res.body.todo.completedAt).toNotExist(); // null
      })
      .end(done)

  });

})

// const testUsers = [{
//   _id: user1_Id,
//   email: 'user1@email.com',
//   password: 'user1pass',
//   tokens: [{
//     access: 'auth',
//     token: jwt.sign({_id: user1_Id.toHexString(), access: 'auth'}, 'abc123').toString()
//   }]
// }, {
//   _id: user2_Id,
//   email: 'user2@email.com',
//   password: 'user2pass',
// }]


describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {

    var token = testUsers[0].tokens[0].token;

    request(app)
      .get('/users/me')
      .set('x-auth', token)
      .expect(200)
      .expect ( (res) => {
        expect(res.body._id).toBe(testUsers[0]._id.toHexString())
        expect(res.body.email).toBe(testUsers[0].email);
      })
      .end(done);


  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect ( (res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
})

describe('POST /users', () => {
  var email = 'test@test.com';
  var password = '123456';
  it('should create a user', (done) => {
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findOne({email})
          .then ((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          })
          .catch( (e) => {
            done(e);
          })
      })
  });

  it('should return validation error', (done) => {
    var email = 'test';
    var password = '123';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });

  it('should not create user if email in user', (done) => {
    var user2_email = testUsers[1].email;

    request(app)
      .post('/users')
      .send({email: user2_email, password: '123456'})
      .expect(400)
      .end(done)
  });
})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: testUsers[1].email,
        password: testUsers[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end( (err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(testUsers[1]._id)
          .then( (user) => {
            expect(user.tokens[0]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done()
          })
          .catch( (e) => {
            done(e);
          })

      });

  });

  it ('should reject Invalid login - 404 User not found', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: 'abc',
        password: '123'
      })
      .expect(404)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end(done)
  });

  it ('should reject Invalid login - 401 Invalid password', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: testUsers[1].email,
        password: '123'
      })
      .expect(401)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end( (err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(testUsers[1]._id)
          .then( (user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch( (e) => {
            done(e);
          })

      });
  });
})
