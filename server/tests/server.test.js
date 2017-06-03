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

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
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
          return done (err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done (e));

      })
  })

  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post ('/todos')
      .send()
      .expect(400)    
      .end( (err, res) => {
        if (err) {
          return done (err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done (e));

      })
  });
})
