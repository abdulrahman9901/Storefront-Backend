"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
// @ts-ignore
const database_1 = __importDefault(require("../database"));
class ProductStore {
    authenticate(username, password) {
        throw new Error('Method not implemented.');
    }
    async index() {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM Products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get Products. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM Products WHERE id=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find Product ${id}. Error: ${err}`);
        }
    }
    async create(P) {
        try {
            const sql = 'INSERT INTO Products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn
                .query(sql, [P.name, P.price, P.category]);
            const Product = result.rows[0];
            conn.release();
            return Product;
        }
        catch (err) {
            throw new Error(`Could not add new Product ${P.name}. Error: ${err}`);
        }
    }
    async update(Product) {
        //console.log(Product)
        try {
            const sql = 'UPDATE Products SET name=$1 , price=$2, category=$3 WHERE id=$4  RETURNING *';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [Product.name, Product.price, Product.category, Product.id]);
            const product = result.rows[0];
            conn.release();
            return product;
        }
        catch (err) {
            throw new Error(`Could not update Products ${Product.name}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM Products WHERE id=($1) RETURNING * ;';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const Product = result.rows[0];
            conn.release();
            return Product;
        }
        catch (err) {
            throw new Error(`Could not delete Product ${id}. Error: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
