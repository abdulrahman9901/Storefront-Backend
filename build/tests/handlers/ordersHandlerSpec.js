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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const request = (0, supertest_1.default)(server_1.default);
var token;
describe('orders Handlers', () => {
    beforeAll(async () => {
        // @ts-ignore
        const connection = await database_1.default.connect();
        let sql = 'INSERT INTO Users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4);';
        await connection.query(sql, [
            test_data_1.test_users[0].username,
            test_data_1.test_users[0].firstname,
            test_data_1.test_users[0].lastname,
            test_data_1.hashedPassword
        ]);
        sql = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3);';
        await connection.query(sql, [
            test_data_1.test_products[0].name,
            test_data_1.test_products[0].price,
            test_data_1.test_products[0].category,
        ]);
        sql = 'INSERT INTO Orders (user_id,status) VALUES($1, $2);';
        await connection.query(sql, [
            test_data_1.test_orders[0].user_id,
            test_data_1.test_orders[0].status,
        ]);
        token = jsonwebtoken_1.default.sign({ user: test_data_1.test_users[0] }, process.env.TOKEN_SECRET);
        connection.release();
    });
    it('posts /orders/ create a orders and returns it.', async () => {
        const response = await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send(test_data_1.test_orders[1]);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual({ id: 2, ...test_data_1.test_orders[1] });
    }),
        it('gets /orders: returns a list of orders in JSON format', async () => {
            const response = await request
                .get('/orders')
                .set('Authorization', `Bearer ${token}`);
            const result = response.body;
            expect(response.status).toBe(200);
            for (let i = 0; i < result.length; i++) {
                expect(lodash_1.default.pick(result[i], ['id', 'user_id', 'status'])).toEqual({
                    id: i + 1,
                    user_id: test_data_1.test_orders[i].user_id,
                    status: test_data_1.test_orders[i].status,
                });
            }
        });
    it('gets /orders/:id: returns a order in JSON format.', async () => {
        const response = await request
            .get('/orders/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const result = response.body;
        expect(lodash_1.default.pick(result, ['id', 'user_id', 'status'])).toEqual({
            id: 1,
            user_id: test_data_1.test_orders[0].user_id,
            status: test_data_1.test_orders[0].status,
        });
    });
    it('put /orders update and returns a order in JSON format.', async () => {
        const response = await request
            .put('/orders/update')
            .set('Authorization', `Bearer ${token}`)
            .send({ id: 1, status: 'active', ...lodash_1.default.pick(test_data_1.test_orders[0], ['user_id']) });
        expect(response.status).toBe(200);
        const result = response.body;
        expect(lodash_1.default.pick(result, ['id', 'user_id', 'status'])).toEqual({
            id: 1,
            user_id: test_data_1.test_orders[0].user_id,
            status: 'active',
        });
    });
    it('gets orders/current/:user_id returns a list of active orders for certain user', async () => {
        const response = await request
            .get('/orders/current/1')
            .set('Authorization', `Bearer ${token}`);
        const result = response.body;
        expect(response.status).toBe(200);
        for (let i = 0; i < result.length; i++) {
            expect(lodash_1.default.pick(result[i], ['status'])).toEqual({
                status: 'active',
            });
        }
    });
    it('delete /orders: returns deleted order ', async () => {
        const response = await request
            .delete('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ id: 1 });
        expect(response.status).toBe(200);
        expect(lodash_1.default.pick(response.body, ['id', 'user_id', 'status'])).toEqual({
            id: 1,
            user_id: test_data_1.test_orders[0].user_id,
            status: 'active',
        });
    });
    afterAll(async () => {
        //@ts-ignore
        const connection = await database_1.default.connect();
        await connection.query('DELETE  FROM Orders;');
        await connection.query('ALTER SEQUENCE Orders_id_seq RESTART WITH 1;');
        await connection.query('DELETE  FROM Products;');
        await connection.query('ALTER SEQUENCE Products_id_seq RESTART WITH 1;');
        await connection.query('DELETE  FROM Users;');
        await connection.query('ALTER SEQUENCE Users_id_seq RESTART WITH 1;');
        connection.release();
    });
});
