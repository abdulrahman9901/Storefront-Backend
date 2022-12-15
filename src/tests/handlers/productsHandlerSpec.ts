import supertest from 'supertest';
import  app  from '../../server';
import { test_products ,hashedPassword ,pepper, test_users} from '../test_data';
// @ts-ignore
import client from '../../database';
import _ from 'lodash';
import { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'
const request = supertest(app);

var token :string;

describe('products Handlers', () => {
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

   sql ='INSERT INTO Products (name, price, category) VALUES ($1, $2, $3);';

  await connection.query(sql, [
    test_products[0].name,
    test_products[0].price,
    test_products[0].category,
    ]);

    token = jwt.sign({ user:test_users[0] }, process.env.TOKEN_SECRET as Secret);
    connection.release();
  });

  it('posts /products/ create a products and returns it.', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(test_products[1]);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual({id:2,...test_products[1]});
  }),
  it('gets /products: returns a list of products in JSON format', async () => {
    const response = await request
      .get('/products')
      .set('Authorization', `Bearer ${token}`);

    const result = response.body;

    expect(response.status).toBe(200);

    for(let i=0;i<result.length;i++) {
      expect(_.pick(result[i], ['id', 'name', 'price', 'category'])).toEqual({
        id:i+1,
        name: test_products[i].name,
        price: test_products[i].price,
        category: test_products[i].category,
      });
      }
  });

  it('gets /products/:id: returns a product in JSON format.', async () => {
    const response = await request
      .get('/products/1')
      .set('Authorization', `Bearer ${token}`);


    expect(response.status).toBe(200);

    const result = response.body;

    expect(_.pick(result, ['id', 'name', 'price', 'category'])).toEqual({
      id: 1,
      name: test_products[0].name,
      price: test_products[0].price,
      category: test_products[0].category,
    });

  });

  it('put /products update and returns a product in JSON format.', async () => {
    const response = await request
      .put('/products/update')
      .set('Authorization', `Bearer ${token}`)
      .send({id:1,name:"new name",..._.pick(test_products[0],['price', 'category'])});

    expect(response.status).toBe(200);

    const result = response.body;

    expect(_.pick(result, ['id', 'name', 'price', 'category'])).toEqual({
      id: 1,
      name: "new name",
      price: test_products[0].price,
      category: test_products[0].category,
    });

  });
  
  it('delete /products: returns deleted product ', async () => {
    const response = await request
      .delete('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({id:1});

      expect(response.status).toBe(200);

      
      expect(_.pick(response.body, ['id', 'name', 'price', 'category'])).toEqual({
        id: 1,
        name: "new name",
        price: test_products[0].price,
        category: test_products[0].category,
      });

  });
  afterAll(async () => {
    //@ts-ignore
    const connection = await client.connect();
    await connection.query('DELETE  FROM products;');
    await connection.query('ALTER SEQUENCE products_id_seq RESTART WITH 1;');
    await connection.query('DELETE  FROM Users;');
    await connection.query('ALTER SEQUENCE Users_id_seq RESTART WITH 1;');
    connection.release();
  })
});
