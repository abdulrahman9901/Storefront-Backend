import { Product } from '../models/products' ;
import { User } from '../models/users';
import { Order } from '../models/orders';
import bcrypt from 'bcrypt'

const {SALT_ROUNDS ,PEPPER}  =process.env

export const saltRounds:string = SALT_ROUNDS as string
export const pepper:string = PEPPER as string

export const test_products:Product[] =[{
    name: 'banana', 
    price: 25,
    category: 'fruits'
  },{
    name: 'apple', 
    price: 25,
    category: 'fruits'
  }]

export const test_orders:Order[] =[{
    product_id: 1, 
    user_id: 1, 
    quantity: 5, 
    status :"complete", 
  },{
    product_id: 1, 
    user_id: 1, 
    quantity: 10, 
    status :'active', 
  }]

export const test_users:User[] =[{
    firstname: 'john',
    lastname: 'doe',
    username: 'joe',
    password: 'this is a fancy password'
  },{
    firstname: 'Katherine',
    lastname: 'Paterson',
    username: 'Kate',
    password: 'this is my password'
  }]
export const hashedPassword = bcrypt.hashSync(
    test_users[0].password + PEPPER,
    parseInt(SALT_ROUNDS as unknown as string)
  )