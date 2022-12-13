"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../../models/orders");
const lodash_1 = __importDefault(require("lodash"));
const test_data_1 = require("../test_data");
//@ts-ignore
const database_1 = __importDefault(require("../../database"));
const store = new orders_1.OrderStore();
describe("Order Model", () => {
    describe("Order Model methods exist ", () => {
        it('should have an index method', () => {
            expect(store.index).toBeDefined();
        });
        it('should have a show method', () => {
            expect(store.show).toBeDefined();
        });
        it('should have a create method', () => {
            expect(store.create).toBeDefined();
        });
        it('should have a update method', () => {
            expect(store.update).toBeDefined();
        });
        it('should have a delete method', () => {
            expect(store.delete).toBeDefined();
        });
    });
    describe("Order Model methods operate as expected ", () => {
        beforeAll(async () => {
            // @ts-ignore
            const connection = await database_1.default.connect();
            let sql = 'INSERT INTO Users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4);';
            await connection.query(sql, [
                'Kate',
                'Katherine',
                'Paterson',
                'this is my password'
            ]);
            sql = 'INSERT INTO Products (name, price, category) VALUES ($1, $2, $3);';
            await connection.query(sql, [
                'banana',
                25,
                'fruits'
            ]);
            sql = 'INSERT INTO Orders (product_id,user_id,quantity, status) VALUES($1, $2, $3, $4);';
            await connection.query(sql, [
                test_data_1.test_orders[0].product_id,
                test_data_1.test_orders[0].user_id,
                test_data_1.test_orders[0].quantity,
                test_data_1.test_orders[0].status,
            ]);
            connection.release();
        });
        it('create method should add a Order', async () => {
            const result = await store.create({
                product_id: test_data_1.test_orders[1].product_id,
                user_id: test_data_1.test_orders[1].user_id,
                quantity: test_data_1.test_orders[1].quantity,
                status: test_data_1.test_orders[1].status,
            });
            expect(lodash_1.default.pick(result, ['id', 'product_id', 'user_id', 'quantity', 'status'])).toEqual({
                id: 2,
                product_id: test_data_1.test_orders[1].product_id,
                user_id: test_data_1.test_orders[1].user_id,
                quantity: test_data_1.test_orders[1].quantity,
                status: test_data_1.test_orders[1].status,
            });
        });
        it('index method should return a list of Orders', async () => {
            const result = await store.index();
            for (let i = 0; i < result.length; i++) {
                expect(lodash_1.default.pick(result[i], ['id', 'product_id', 'user_id', 'quantity', 'status'])).toEqual({
                    id: i + 1,
                    product_id: test_data_1.test_orders[i].product_id,
                    user_id: test_data_1.test_orders[i].user_id,
                    quantity: test_data_1.test_orders[i].quantity,
                    status: test_data_1.test_orders[i].status,
                });
            }
        });
        it('show method should return the correct Order', async () => {
            const result = await store.show("1");
            expect(lodash_1.default.pick(result, ['id', 'product_id', 'user_id', 'quantity', 'status'])).toEqual({
                id: 1,
                product_id: test_data_1.test_orders[0].product_id,
                user_id: test_data_1.test_orders[0].user_id,
                quantity: test_data_1.test_orders[0].quantity,
                status: test_data_1.test_orders[0].status,
            });
        });
        it('update method should update the Order data', async () => {
            const result = await store.update({
                id: 1,
                product_id: test_data_1.test_orders[0].product_id,
                user_id: test_data_1.test_orders[0].user_id,
                quantity: 15,
                status: 'active',
            });
            expect({ quantity: result.quantity, status: result.status }).toEqual({ quantity: 15, status: 'active' });
        });
        it('current method should return current active Order for user', async () => {
            const result = await store.current('1');
            expect(result.length).toEqual(2);
        });
        it('delete method should remove the Order', async () => {
            await store.delete("2");
            const result = await store.index();
            expect(result.length).toEqual(1);
        });
        afterAll(async () => {
            //@ts-ignore
            const connection = await database_1.default.connect();
            await connection.query('DELETE  FROM Orders;');
            await connection.query('ALTER SEQUENCE Orders_id_seq RESTART WITH 1;');
            await connection.query('DELETE  FROM Users;');
            await connection.query('ALTER SEQUENCE Users_id_seq RESTART WITH 1;');
            await connection.query('DELETE  FROM Products;');
            await connection.query('ALTER SEQUENCE Products_id_seq RESTART WITH 1;');
            connection.release();
        });
    });
});
