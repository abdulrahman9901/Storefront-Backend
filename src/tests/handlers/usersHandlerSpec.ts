import supertest from 'supertest';
import  app  from '../../server';
import { test_users ,hashedPassword ,pepper} from '../test_data';
// @ts-ignore
import client from '../../database';
import _ from 'lodash';
import bcrypt from 'bcrypt'

const request = supertest(app);

var token :string;

describe('Users Handlers', () => {
  beforeAll(async () => {
    // @ts-ignore
    const connection = await client.connect();
    const sql ='INSERT INTO Users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4);';

      await connection.query(sql, [
      test_users[0].username,
      test_users[0].firstname,
      test_users[0].lastname,
      hashedPassword
      ]);
    connection.release();
  });
  it('posts /users/auth authenticate user using username and password returns a token', async () => {
    const response = await request
      .post('/users/auth')
      .send({username:test_users[0].username,password:test_users[0].password});
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(String);
    expect(response.body).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
    token = response.body;
  })
  it('posts /users/ create a user and returns a token.', async () => {
    const response = await request
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(test_users[1]);

      expect(response.body).toBeInstanceOf(String);
    expect(response.body).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
  }),
  it('gets /users: returns a list of users in JSON format with hashed passwords', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    const result = response.body;

    expect(response.status).toBe(200);

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

  it('gets /users/:id: returns a user in JSON format with a hashed password', async () => {
    const response = await request
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`);


    expect(response.status).toBe(200);

    const result = response.body;

    expect(_.pick(result, ['id', 'username', 'firstname', 'lastname'])).toEqual({
      id: 1,
      username: test_users[0].username,
      firstname: test_users[0].firstname,
      lastname: test_users[0].lastname,
    });
    expect(bcrypt.compareSync(test_users[0].password + pepper,result.password)).toBe(true);

  });

  it('put /users/:id: update and returns a user in JSON format with a hashed password', async () => {
    const response = await request
      .put('/users/update')
      .set('Authorization', `Bearer ${token}`)
      .send({id:1,username:"new username",..._.pick(test_users[0],['firstname', 'lastname','password'])});

    expect(response.status).toBe(200);

    const result = response.body;

    token = result.token;

    expect(_.pick(result, ['id', 'username', 'firstname', 'lastname'])).toEqual({
      id: 1,
      username: "new username",
      firstname: test_users[0].firstname,
      lastname: test_users[0].lastname,
    });
    expect(bcrypt.compareSync(test_users[0].password + pepper,result.password)).toBe(true);

  });
  
  it('delete /users: update and returns deleted user ', async () => {
    const response = await request
      .delete('/users')
      .send({id:1})

      expect(response.status).toBe(200);
      expect(_.pick(response.body, ['id', 'username', 'firstname', 'lastname'])).toEqual({
        id: 1,
        username: "new username",
        firstname: test_users[0].firstname,
        lastname: test_users[0].lastname,
      });

  });
  afterAll(async () => {
    //@ts-ignore
    const connection = await client.connect();
    await connection.query('DELETE  FROM Users;');
    await connection.query('ALTER SEQUENCE Users_id_seq RESTART WITH 1;');
    connection.release();
  })
});
