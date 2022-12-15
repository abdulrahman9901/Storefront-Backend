"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
// @ts-ignore
const database_1 = __importDefault(require("../database"));
class OrderStore {
    async index() {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM Orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get Orders. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM Orders WHERE id=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            console.log(result.rows[0]);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find Order ${id}. Error: ${err}`);
        }
    }
    async create(O) {
        try {
            const sql = 'INSERT INTO Orders (status, user_id) VALUES($1, $2) RETURNING *';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn
                .query(sql, [O.status, O.user_id]);
            const Order = result.rows[0];
            conn.release();
            return Order;
        }
        catch (err) {
            throw new Error(`Could not add new Order  ${O.id}. Error: ${err}`);
        }
    }
    async update(Order) {
        //console.log(Order)
        try {
            const sql = 'UPDATE Orders SET user_id = $1, status = $2  WHERE id=$3  RETURNING * ;';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [Order.user_id, Order.status, Order.id]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not Orders User ${Order.id}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM Orders WHERE id=($1) RETURNING *;';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const Order = result.rows[0];
            conn.release();
            return Order;
        }
        catch (err) {
            throw new Error(`Could not delete Order ${id}. Error: ${err}`);
        }
    }
    async current(id) {
        try {
            const sql = "SELECT * FROM Orders WHERE user_id=($1) AND status='active';";
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const Orders = result.rows;
            conn.release();
            return Orders;
        }
        catch (err) {
            throw new Error(`Could not get orders for user_id ${id}. Error: ${err}`);
        }
    }
}
exports.OrderStore = OrderStore;
