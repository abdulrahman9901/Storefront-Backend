import supertest from 'supertest';
import  app  from '../../server';
import { test_orders ,hashedPassword ,pepper, test_users, test_products} from '../test_data';
// @ts-ignore
import client from '../../database';
import _ from 'lodash';
import { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'
const request = supertest(app);

var token :string;

describe('orders Handlers', () => {
  beforeAll(async () => {
    // @ts-ignore
    const connection = await client.connect();

    let sql ='INSERT INTO Users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4);';

    await connection.query(sql, [
    test_users[0].username,
    test_users[0].firstname,
    test_users[0].lastname,
    hashedPassword
    ]);

   sql ='INSERT INTO products (name, price, category) VALUES ($1, $2, $3);';

  await connection.query(sql, [
    test_products[0].name,
    test_products[0].price,
    test_products[0].category,
    ]);

    sql = 'INSERT INTO Orders (product_id,user_id,quantity, status) VALUES($1, $2, $3, $4);'

      await connection.query(sql, [
      test_orders[0].product_id,
      test_orders[0].user_id,
      test_orders[0].quantity,
      test_orders[0].status,
    ]);

    token = jwt.sign({ user:test_users[0] }, process.env.TOKEN_SECRET as Secret);
    connection.release();
  });

  it('posts /orders/ create a orders and returns it.', async () => {
    const response = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(test_orders[1]);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual({id:2,...test_orders[1]});
  }),
  it('gets /orders: returns a list of orders in JSON format', async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);

    const result = response.body;

    expect(response.status).toBe(200);

    for(let i=0;i<result.length;i++) {
      expect(_.pick(result[i], ['id', 'product_id', 'user_id', 'quantity','status'])).toEqual({
        id:i+1,
        product_id: test_orders[i].product_id,
        user_id: test_orders[i].user_id,
        quantity: test_orders[i].quantity,
        status: test_orders[i].status,

      });
      }
  });

  it('gets /orders/:id: returns a user in JSON format.', async () => {
    const response = await request
      .get('/orders/1')
      .set('Authorization', `Bearer ${token}`);


    expect(response.status).toBe(200);

    const result = response.body;

    expect(_.pick(result, ['id', 'product_id', 'user_id', 'quantity','status'])).toEqual({
      id:1,
      product_id: test_orders[0].product_id,
      user_id: test_orders[0].user_id,
      quantity: test_orders[0].quantity,
      status: test_orders[0].status,
    });

  });

  it('put /orders update and returns a user in JSON format.', async () => {
    const response = await request
      .put('/orders/update')
      .set('Authorization', `Bearer ${token}`)
      .send({id:1,quantity:50,status:'active',..._.pick(test_orders[0],['product_id', 'user_id'])});

    expect(response.status).toBe(200);

    const result = response.body;

    expect(_.pick(result, ['id', 'product_id', 'user_id', 'quantity','status'])).toEqual({
      id:1,
      product_id: test_orders[0].product_id,
      user_id: test_orders[0].user_id,
      quantity: 50,
      status: 'active',
    });

  });

  it('gets orders/current/:user_id returns a list of active orders for certain user', async () => {
    const response = await request
      .get('/orders/current/1')
      .set('Authorization', `Bearer ${token}`);

    const result = response.body;

    expect(response.status).toBe(200);

    for(let i=0;i<result.length;i++) {
      expect(_.pick(result[i], ['status'])).toEqual({
        status: 'active',
      });
      }
  });
  
  it('delete /orders: returns deleted user ', async () => {
    const response = await request
      .delete('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({id:1});

      expect(response.status).toBe(200);

      
      expect(_.pick(response.body, ['id', 'product_id', 'user_id', 'quantity','status'])).toEqual({
        id:1,
        product_id: test_orders[0].product_id,
        user_id: test_orders[0].user_id,
        quantity: 50,
        status: 'active',
  });

  });
  afterAll(async () => {
    //@ts-ignore
    const connection = await client.connect();

    await connection.query('DELETE  FROM Orders;');
    await connection.query('ALTER SEQUENCE Orders_id_seq RESTART WITH 1;');
    await connection.query('DELETE  FROM Products;');
    await connection.query('ALTER SEQUENCE Products_id_seq RESTART WITH 1;');
    await connection.query('DELETE  FROM Users;');
    await connection.query('ALTER SEQUENCE Users_id_seq RESTART WITH 1;');

    connection.release();
  })
});
