"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const test_data_1 = require("../test_data");
// @ts-ignore
const database_1 = __importDefault(require("../../database"));
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const request = (0, supertest_1.default)(server_1.default);
var token;
describe('Users Handlers', () => {
    beforeAll(async () => {
        // @ts-ignore
        const connection = await database_1.default.connect();
        const sql = 'INSERT INTO Users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4);';
        await connection.query(sql, [
            test_data_1.test_users[0].username,
            test_data_1.test_users[0].firstname,
            test_data_1.test_users[0].lastname,
            test_data_1.hashedPassword
        ]);
        connection.release();
    });
    it('posts /users/auth authenticate user using username and password returns a token', async () => {
        const response = await request
            .post('/users/auth')
            .send({ username: test_data_1.test_users[0].username, password: test_data_1.test_users[0].password });
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(String);
        expect(response.body).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        token = response.body;
    });
    it('posts /users/ create a user and returns a token.', async () => {
        const response = await request
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(test_data_1.test_users[1]);
        expect(response.body).toBeInstanceOf(String);
        expect(response.body).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    }),
        it('gets /users: returns a list of users in JSON format with hashed passwords', async () => {
            const response = await request
                .get('/users')
                .set('Authorization', `Bearer ${token}`);
            const result = response.body;
            expect(response.status).toBe(200);
            for (let i = 0; i < result.length; i++) {
                expect(lodash_1.default.pick(result[i], ['id', 'username', 'firstname', 'lastname'])).toEqual({
                    id: i + 1,
                    username: test_data_1.test_users[i].username,
                    firstname: test_data_1.test_users[i].firstname,
                    lastname: test_data_1.test_users[i].lastname,
                });
                expect(bcrypt_1.default.compareSync(test_data_1.test_users[i].password + test_data_1.pepper, result[i].password)).toBe(true);
            }
        });
    it('gets /users/:id: returns a user in JSON format with a hashed password', async () => {
        const response = await request
            .get('/users/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const result = response.body;
        expect(lodash_1.default.pick(result, ['id', 'username', 'firstname', 'lastname'])).toEqual({
            id: 1,
            username: test_data_1.test_users[0].username,
            firstname: test_data_1.test_users[0].firstname,
            lastname: test_data_1.test_users[0].lastname,
        });
        expect(bcrypt_1.default.compareSync(test_data_1.test_users[0].password + test_data_1.pepper, result.password)).toBe(true);
    });
    it('put /users/:id: update and returns a user in JSON format with a hashed password', async () => {
        const response = await request
            .put('/users/update')
            .set('Authorization', `Bearer ${token}`)
            .send({ id: 1, username: "new username", ...lodash_1.default.pick(test_data_1.test_users[0], ['firstname', 'lastname', 'password']) });
        expect(response.status).toBe(200);
        const result = response.body;
        token = result.token;
        expect(lodash_1.default.pick(result, ['id', 'username', 'firstname', 'lastname'])).toEqual({
            id: 1,
            username: "new username",
            firstname: test_data_1.test_users[0].firstname,
            lastname: test_data_1.test_users[0].lastname,
        });
        expect(bcrypt_1.default.compareSync(test_data_1.test_users[0].password + test_data_1.pepper, result.password)).toBe(true);
    });
    it('delete /users: update and returns deleted user ', async () => {
        const response = await request
            .delete('/users')
            .send({ id: 1 });
        expect(response.status).toBe(200);
        expect(lodash_1.default.pick(response.body, ['id', 'username', 'firstname', 'lastname'])).toEqual({
            id: 1,
            username: "new username",
            firstname: test_data_1.test_users[0].firstname,
            lastname: test_data_1.test_users[0].lastname,
        });
    });
    afterAll(async () => {
        //@ts-ignore
        const connection = await database_1.default.connect();
        await connection.query('DELETE  FROM Users;');
        await connection.query('ALTER SEQUENCE Users_id_seq RESTART WITH 1;');
        connection.release();
    });
});
