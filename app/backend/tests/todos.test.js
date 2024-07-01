const request = require('supertest');
const app = require('../index');

describe('Todos API', () => {
  let server;
  let token;

  beforeAll(async () => {
    const port = 5000 + Math.floor(Math.random() * 1000); // Menggunakan port dinamis
    process.env.PORT = port;
    server = app.listen(port);

    // Register a user and log in to get a token
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'password'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password'
      });

    token = loginRes.body.token;
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should create a new todo', async () => {
    const res = await request(server)
      .post('/api/todos')
      .set('x-auth-token', token)
      .send({
        text: 'Test Todo'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('text', 'Test Todo');
    expect(res.body).toHaveProperty('completed', false);
  });

  it('should get all todos', async () => {
    const res = await request(server)
      .get('/api/todos')
      .set('x-auth-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should update a todo', async () => {
    // Create a new todo first
    const todo = await request(server)
      .post('/api/todos')
      .set('x-auth-token', token)
      .send({
        text: 'Test Todo to Update'
      });

    const res = await request(server)
      .put(`/api/todos/${todo.body.id}`)
      .set('x-auth-token', token)
      .send({
        text: 'Updated Todo',
        completed: true
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('msg', 'Todo updated');
  });

  it('should delete a todo', async () => {
    // Create a new todo first
    const todo = await request(server)
      .post('/api/todos')
      .set('x-auth-token', token)
      .send({
        text: 'Test Todo to Delete'
      });

    const res = await request(server)
      .delete(`/api/todos/${todo.body.id}`)
      .set('x-auth-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('msg', 'Todo deleted');
  });
});
