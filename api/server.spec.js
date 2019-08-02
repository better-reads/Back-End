const request = require('supertest')
const db = require('../data/dbConfig.js')
const server = require('./server.js')

let token

beforeAll(done => {
    request(server)
        .post("/api/auth/register")
        .send({
            username: "jarred2",
            password: "password"
        })
        .end((error, res) => {
            if (error) return done(error);
            done();
        });
});
beforeAll(done => {
    request(server)
        .post("/api/auth/login")
        .send({
            username: "jarred2",
            password: "password"
        })
        .end((error, res) => {
            if (error) return done(error);
            token = res.body.token;
            done();
        });
});


describe('server', () => {
    it('db environment set to testing', () => {
        expect(process.env.DB_env).toBe('testing')
    })

    describe('POST /api/auth/register', () => {
        it('should return 201 OK and new username', () => {
            const user = {
                username: `jarred`,
                password: 'nah'
            }
            return request(server)
                .post('/api/auth/register')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(201)
                    expect(res.body.username).toBe(user.username)
                })
        })


        it('requests with a username already in the DB should return 400', () => {
            const user = {
                username: "jarred",
                password: "nah"
            }
            const error = "A user with this name already exists."

            return request(server)
                .post('/api/auth/register')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.message).toBe(error)
                })
        })

        it('requests without a username or password should return 400', () => {
            const user = {
                username: "jarred8"
            }
            const error = "Username & password are required."
            return request(server)
                .post('/api/auth/register')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.message).toBe(error)
                })
        })
    })

    describe('POST /api/auth/login', () => {
        it('should return 200 OK', () => {
            const user = {
                username: 'jarred',
                password: 'nah'
            }

            return request(server)
                .post('/api/auth/login')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(200)
                })
        })
        it('requests without a login or password should return 400', () => {
            const user = {
                username: 'jarred8'
            }
            const error = "Username & password are required."

            return request(server)
                .post('/api/auth/login')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.message).toBe(error)
                })
        })
    })

    describe('/POST /api/books/save/:user_id', () => {
        it('should return 201', () => {
            const book = {
                "isbn": "1984853750",
                "title": "The Bell Jar",
                "author": "Sylvia Plath"
            }

            return request(server)
                .post('/api/books/save/1')
                .set('Authorization', token)
                .send(book)
                .then(res => {
                    expect(res.status).toBe(201)
                })
        })

    })


    describe('/PUT /api/auth/:user_id', () => {
        it('take in user changes, verifies current user is updating, return 201', () => {
            const user = {
                "username": "mariah",
                "password": "nah23",
                "bio": "My name is Boxxy2, you can call me...well, Boxxy I suppose.",
                "email": "nah2@nah.com",
                "country": "United States",
                "emailNotifications": true,
                "firstName": "Jarred",
                "lastName": "Stanford"
            }

            return request(server)
                .put('/api/auth/1')
                .set({ Authorization: token })
                .send(user)
                .then(res => {
                    expect(res.status).toBe(201)
                })

        })
    })

    describe('/GET /api/users/:user_id', () => {
        it('take in user_id, return 200', () => {
            return request(server)
                .get('/api/users/1')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        })
    })

    describe('/GET /api/users/list/:user_id', () => {
        it('take in user_id, return 200', () => {
            return request(server)
                .get('/api/users/list/1')
                .then(res => {
                    expect(res.status).toBe(200)
                })
        })
    })

    describe('/DELETE /api/books/save/:user_id', () => {
        it('should return 201', () => {
            const bookID = {
                book_id: 1
            }

            return request(server)
                .delete('/api/books/save/1')
                .set('Authorization', token)
                .send(bookID)
                .then(res => {
                    expect(res.status).toBe(201)
                })
        })

    })

    describe('/GET /api/books/recommend', () => {
        it('should return status 200', () => {
            const description = {
                description: "car focus group designer"
            }
            return request(server)
                .post('/api/books/recommend')
                .send(description)
                .then(res => {
                    expect(res.status).toBe(200)
                })
        })
    })

    afterAll(async () => {

        await db('users').truncate();
    });
})