"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashedPassword = exports.test_users = exports.test_orders = exports.test_products = exports.pepper = exports.saltRounds = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const { SALT_ROUNDS, PEPPER } = process.env;
exports.saltRounds = SALT_ROUNDS;
exports.pepper = PEPPER;
exports.test_products = [{
        name: 'banana',
        price: 25,
        category: 'fruits'
    }, {
        name: 'apple',
        price: 25,
        category: 'fruits'
    }];
exports.test_orders = [{
        user_id: 1,
        status: "complete",
    }, {
        user_id: 1,
        status: 'active',
    }];
exports.test_users = [{
        firstname: 'john',
        lastname: 'doe',
        username: 'joe',
        password: 'this is a fancy password'
    }, {
        firstname: 'Katherine',
        lastname: 'Paterson',
        username: 'Kate',
        password: 'this is my password'
    }];
exports.hashedPassword = bcrypt_1.default.hashSync(exports.test_users[0].password + PEPPER, parseInt(SALT_ROUNDS));
