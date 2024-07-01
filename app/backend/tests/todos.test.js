const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); // Pastikan ini mengimpor server Express Anda
const should = chai.should();

chai.use(chaiHttp);

describe('Todos API', () => {

    let token;

    // Login user before running the tests
    before((done) => {
        const user = {
            email: 'test@test.com',
            password: 'password'
        };
        chai.request(server)
            .post('/api/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                token = res.body.token;
                done();
            });
    });

    describe('/GET todos', () => {
        it('it should GET all the todos', (done) => {
            chai.request(server)
                .get('/api/todos')
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('/POST todo', () => {
        it('it should POST a new todo', (done) => {
            let todo = {
                title: 'Test Todo',
                completed: false
            };
            chai.request(server)
                .post('/api/todos')
                .set('x-auth-token', token)
                .send(todo)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').eql('Test Todo');
                    res.body.should.have.property('completed').eql(false);
                    done();
                });
        });
    });

    describe('/PUT/:id todo', () => {
        it('it should UPDATE a todo given the id', (done) => {
            let todo = new Todo({
                title: 'Test Todo',
                completed: false
            });
            todo.save((err, todo) => {
                chai.request(server)
                    .put('/api/todos/' + todo.id)
                    .set('x-auth-token', token)
                    .send({ title: 'Updated Test Todo', completed: true })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title').eql('Updated Test Todo');
                        res.body.should.have.property('completed').eql(true);
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:id todo', () => {
        it('it should DELETE a todo given the id', (done) => {
            let todo = new Todo({
                title: 'Test Todo',
                completed: false
            });
            todo.save((err, todo) => {
                chai.request(server)
                    .delete('/api/todos/' + todo.id)
                    .set('x-auth-token', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('msg').eql('Todo removed');
                        done();
                    });
            });
        });
    });
});
