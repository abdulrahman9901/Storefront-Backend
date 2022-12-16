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
describe('products Handlers', () => {
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
        sql = 'INSERT INTO Products (name, price, category) VALUES ($1, $2, $3);';
        await connection.query(sql, [
            test_data_1.test_products[0].name,
            test_data_1.test_products[0].price,
            test_data_1.test_products[0].category,
        ]);
        token = jsonwebtoken_1.default.sign({ user: test_data_1.test_users[0] }, process.env.TOKEN_SECRET);
        connection.release();
    });
    it('posts /products/ create a products and returns it.', async () => {
        const response = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(test_data_1.test_products[1]);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual({ id: 2, ...test_data_1.test_products[1] });
    }),
        it('gets /products: returns a list of products in JSON format', async () => {
            const response = await request
                .get('/products')
                .set('Authorization', `Bearer ${token}`);
            const result = response.body;
            expect(response.status).toBe(200);
            for (let i = 0; i < result.length; i++) {
                expect(lodash_1.default.pick(result[i], ['id', 'name', 'price', 'category'])).toEqual({
                    id: i + 1,
                    name: test_data_1.test_products[i].name,
                    price: test_data_1.test_products[i].price,
                    category: test_data_1.test_products[i].category,
                });
            }
        });
    it('gets /products/:id: returns a product in JSON format.', async () => {
        const response = await request
            .get('/products/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const result = response.body;
        expect(lodash_1.default.pick(result, ['id', 'name', 'price', 'category'])).toEqual({
            id: 1,
            name: test_data_1.test_products[0].name,
            price: test_data_1.test_products[0].price,
            category: test_data_1.test_products[0].category,
        });
    });
    it('put /products update and returns a product in JSON format.', async () => {
        const response = await request
            .put('/products/update')
            .set('Authorization', `Bearer ${token}`)
            .send({ id: 1, name: "new name", ...lodash_1.default.pick(test_data_1.test_products[0], ['price', 'category']) });
        expect(response.status).toBe(200);
        const result = response.body;
        expect(lodash_1.default.pick(result, ['id', 'name', 'price', 'category'])).toEqual({
            id: 1,
            name: "new name",
            price: test_data_1.test_products[0].price,
            category: test_data_1.test_products[0].category,
        });
    });
    it('delete /products: returns deleted product ', async () => {
        const response = await request
            .delete('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ id: 1 });
        expect(response.status).toBe(200);
        expect(lodash_1.default.pick(response.body, ['id', 'name', 'price', 'category'])).toEqual({
            id: 1,
            name: "new name",
            price: test_data_1.test_products[0].price,
            category: test_data_1.test_products[0].category,
        });
    });
    afterAll(async () => {
        //@ts-ignore
        const connection = await database_1.default.connect();
        await connection.query('DELETE  FROM products;');
        await connection.query('ALTER SEQUENCE products_id_seq RESTART WITH 1;');
        await connection.query('DELETE  FROM Users;');
        await connection.query('ALTER SEQUENCE Users_id_seq RESTART WITH 1;');
        connection.release();
    });
});
