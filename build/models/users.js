"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
// @ts-ignore
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { SALT_ROUNDS, PEPPER } = process.env;
const saltRounds = SALT_ROUNDS;
const pepper = PEPPER;
class UserStore {
    async index() {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM Users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get Users. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM Users WHERE id=($1);';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not get User ${id}. Error: ${err}`);
        }
    }
    async create(User) {
        //console.log("input",User)
        try {
            const sql = 'INSERT INTO Users(username, firstname, lastname, password) VALUES($1, $2, $3, $4) RETURNING *';
            const hash = bcrypt_1.default.hashSync(User.password + pepper, parseInt(saltRounds));
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [User.username, User.firstname, User.lastname, hash]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not add User ${User.firstname}. Error: ${err}`);
        }
    }
    async authenticate(username, password) {
        // @ts-ignore
        const conn = await database_1.default.connect();
        const sql = 'SELECT id,username,firstname,lastname,password FROM Users WHERE username=($1);';
        const result = await conn.query(sql, [username]);
        //console.log("this at auth ",result.rows)
        if (result.rows.length) {
            const user = result.rows[0];
            if (bcrypt_1.default.compareSync(password + pepper, user.password)) {
                return user;
            }
        }
        return null;
    }
    async update(User) {
        try {
            const sql = 'UPDATE Users SET username=$1 , firstname=$2, lastname=$3, password=$4 WHERE id=$5  RETURNING *';
            const hash = bcrypt_1.default.hashSync(User.password + pepper, parseInt(saltRounds));
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [User.username, User.firstname, User.lastname, hash, User.id]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not update User ${User.firstname}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM Users WHERE id=($1) RETURNING *';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not delete User ${id}. Error: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
