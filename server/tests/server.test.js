const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {UserModel} = require('./../models/users');

const todos = [{
  _id:new ObjectID(),
  text:"Test 1"
}, {
  _id:new ObjectID(),
  text:"Test 2"
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos',() => {
  it('should create a new todo',(done) => {
    var text = 'Test 1';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err)
          return done(err);
        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          expect(todos[0].text).toBe(text);
          done();
        })
        .catch((err) => {
          done(err);
        })
      });
  });
  var text="Ehhhh";
  it('should not create a todo with invalid body data',(done) => {
    request(app)
      .post('/todos')
      .send({test:text})
      .expect(400)
      .end((err,res) => {
        if(err)
          return done(err);
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => {
          return done(e);
        })
      })

  });
})

describe('GET /todos/:id',() => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.resp.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404 if todo not found',(done) => {
    var hexId = new ObjectID().toHexString();
    console.log(hexId);
    request(app)
      .get(`/todos/a5be0e3b058b8f215sa4358f`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-object ids', (done) => {
    request(app)
      .get('todos/123abc')
      .expect(404)
      .end(done);
  });
})
