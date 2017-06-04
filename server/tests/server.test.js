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

const testTodos = [{ _id: new ObjectID(), text : 'Test note 1'}, {_id: new ObjectID(), text : 'Test note 2'}];

// runs before each test.. populating Seed data
beforeEach((done) => {
  Todo.remove({}).then( () => {
    return Todo.insertMany(testTodos);
  }).then( () => done());
});

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
