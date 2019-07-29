const request = require('supertest')
const db = require('../data/dbConfig.js')
const server = require('./server.js')

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
                username: "jarred2"
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

    describe('POST /api/login', () => {
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
                username: 'jarred'
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
    afterAll(async () => {

        await db('users').truncate();
    });
})