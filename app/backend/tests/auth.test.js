const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); // Pastikan ini mengimpor server Express Anda
const should = chai.should();

chai.use(chaiHttp);

describe('Auth Routes', () => {
    describe('/POST register', () => {
        it('it should register a new user', (done) => {
            let user = {
                email: 'test@test.com',
                password: 'password'
            }
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql('User registered');
                    done();
                });
        });
    });

    describe('/POST login', () => {
        it('it should login an existing user', (done) => {
            let user = {
                email: 'test@test.com',
                password: 'password'
            }
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
    });
});
