import { Product, ProductStore } from '../../models/products' ;
import _ from 'lodash'
import { test_products } from '../test_data';
//@ts-ignore
import Client from '../../database'

const store = new ProductStore()

describe("Product Model", () => {

  describe("Product Model methods exist ", () => {
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

describe("Product Model methods operate as expected ", () => {
  beforeAll(async () => {
    // @ts-ignore
    const connection = await Client.connect();
    let sql ='INSERT INTO Products (name, price, category) VALUES ($1, $2, $3);';

      await connection.query(sql, [
      test_products[0].name,
      test_products[0].price,
      test_products[0].category,
    ]);
    /*
    sql ='INSERT INTO Users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4);';

    await connection.query(sql, [
      'test',
      'test_products',
      'user',
      'this is a fancy password'
  ]);
  */
    connection.release();

    // token = await store.authenticate('test','this is a fancy password');

    // console.log(token);

  });

  it('create method should add a Product', async () => {

    const result = await store.create({
      name: test_products[1].name,
      price: test_products[1].price,
      category: test_products[1].category,
    });

    expect(_.pick(result, ['id', 'name', 'price', 'category'])).toEqual({
      id: 2,
      name: test_products[1].name,
      price: test_products[1].price,
      category: test_products[1].category,
    });

  });

  it('index method should return a list of Products', async () => {
    const result = await store.index();

    for(let i=0;i<result.length;i++) {
      expect(_.pick(result[i], ['id', 'name', 'price', 'category'])).toEqual({
        id:i+1,
        name: test_products[i].name,
        price: test_products[i].price,
        category: test_products[i].category,
      });
      }
  });

  it('show method should return the correct Product', async () => {

    const result = await store.show("1");


    expect(_.pick(result, ['id', 'name', 'price', 'category'])).toEqual({
      id: 1,
      name: test_products[0].name,
      price: test_products[0].price,
      category: test_products[0].category,
    });
  });

  it('update method should update the Product data', async () => {
        
    const result = await store.update({
      id: 1,
      name: 'mangos',
      price: 35,
      category: 'fruits'
    })

    expect({name:result.name,price:result.price}).toEqual({name: 'mangos',price:35});
  });
  it('delete method should remove the Product', async () => {
    
    await store.delete("2");
    
    const result = await store.index()

    expect(result.length).toEqual(1);
  });
});

});