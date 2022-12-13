import { User, UserStore } from '../../models/users' ;
import bcrypt from 'bcrypt'
import _ from 'lodash'
import { test_users ,hashedPassword } from '../test_data';
//@ts-ignore
import Client from '../../database'
const {SALT_ROUNDS ,PEPPER}  =process.env

const saltRounds:string = SALT_ROUNDS as string
const pepper:string = PEPPER as string

const store = new UserStore()

describe("User Model", () => {

  describe("User Model methods exist ", () => {
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

  it('should have a authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

});

describe("User Model methods operate as expected ", () => {
  beforeAll(async () => {
    // @ts-ignore
    const connection = await Client.connect();
    const sql ='INSERT INTO Users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4);';

      await connection.query(sql, [
      test_users[0].username,
      test_users[0].firstname,
      test_users[0].lastname,
      hashedPassword
      ]);
    connection.release();
  });

  it('create method should add a User', async () => {

    const result = await store.create({
      firstname: test_users[1].firstname,
      lastname: test_users[1].lastname,
      username: test_users[1].username,
      password: test_users[1].password
    });

    expect(_.pick(result, ['id', 'username', 'firstname', 'lastname'])).toEqual({
      id: 2,
      firstname: test_users[1].firstname,
      lastname: test_users[1].lastname,
      username: test_users[1].username,
    });

    expect(bcrypt.compareSync( test_users[1].password+ pepper,result.password)).toBe(true);

  });

  it('index method should return a list of Users', async () => {
    const result = await store.index();

    for(let i=0;i<result.length;i++) {
      expect(_.pick(result[i], ['id', 'username', 'firstname', 'lastname'])).toEqual({
        id:i+1,
        username: test_users[i].username,
        firstname: test_users[i].firstname,
        lastname: test_users[i].lastname,
      });
  
      expect(bcrypt.compareSync(test_users[i].password+pepper,result[i].password)).toBe(true);
    }
  });

  it('show method should return the correct User', async () => {

    const result = await store.show("1");


    expect(_.pick(result, ['id', 'username', 'firstname', 'lastname'])).toEqual({
      id: 1,
      username: test_users[0].username,
      firstname: test_users[0].firstname,
      lastname: test_users[0].lastname,
    });
    expect(bcrypt.compareSync(test_users[0].password + pepper,result.password)).toBe(true);
  });

  it('authenticate should return null for wrong user or password ', async () => {

    const result = await store.authenticate('i\'m not joe', 'this is my password');

    expect(result).toBe(null);
  });

  it('authenticate should return a user for the right user and password', async () => {

    const result = await store.authenticate(test_users[0].username,test_users[0].password);

    expect(_.pick(result, ['id', 'username', 'firstname', 'lastname'])).toEqual({
      id: 1,
      username: test_users[0].username,
      firstname: test_users[0].firstname,
      lastname: test_users[0].lastname,
    });
  });

  it('update method should update the User data', async () => {
        
    const result = await store.update({
      id: 1,
      username: 'jo',
      firstname: test_users[0].firstname,
      lastname: test_users[0].lastname,
      password: test_users[0].password
    })

    expect(result.username).toEqual('jo');
  });

  it('delete method should remove the User', async () => {
    
    await store.delete("2");
    
    const result = await store.index()

    expect(result.length).toEqual(1);
  });
});

});