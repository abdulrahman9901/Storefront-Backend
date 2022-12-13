## Introduction ##

This is a REST API simulating an e-commerce backend based on three models: Products, Orders and Users. A detailed list of the endpoints and actions available can be found in the [REQUIREMENTS.md] file.

---
## Setup ##

### Database config ###

The API connects to a postgres database. As a first step, it is necessary to create two databases (development and test) on your local machine. Run the command `psql postgres` in terminal to open the postgres CLI. Then run the following:

```SQL
CREATE USER user WITH PASSWORD 'YOUR_PASSWORD_HERE';
CREATE DATABASE store;
\c store;
GRANT ALL PRIVILEGES ON DATABASE store TO user;
CREATE DATABASE store_test;
\c store_test;
GRANT ALL PRIVILEGES ON DATABASE store_test TO user;
````

To make sure the API can connect to the db it is necessary to create a `database.json` file with the following format

```json
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "store",
    "user": "user",
    "password": 'YOUR_PASSWORD_HERE'
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "store_test",
    "user": "user",
    "password": 'YOUR_PASSWORD_HERE'
  }
}
```

Note: it is best to add this file to a `.gitignore` file in order to keep the password hidden.


### Environment variables ###

The API relies on several environment variables to function. `dotenv` is already included in the `package.json`file, so it is only necessary to create a `.env` file with the following variables:

| Name              | Value            | Notes         |
| ------------------|:----------------:|:-------------:|
| POSTGRES_HOST     | 127.0.0.1        | Same value as in the database.json file |
| POSTGRES_DB       | store       | Same value as in the database.json file |   
| POSTGRES_TEST_DB  | store_test  | Same value as in the database.json file |
| POSTGRES_USER     | user  | Same value as in the database.json file |
| POSTGRES_PASSWORD | YOUR_PASSWORD    | Same value as in the database.json file |
| ENV               | dev              | Used to set the DB environment. The test script automatically sets it to 'test' when runnning.|
| PORT              | YOUR_PORT        | The API will run on http://localhost.3000 by default, but there is the option to select a custom port as an envrionment variable |
| SALT_ROUNDS       | 10               | Number of salt rounds the password hashing function of the bcrypt package will be using|
| PEPPER            | YOUR_STRING_HERE | A string of your choice that bcrypt will be adding prior to hashing passwords for an extra layer of security |
| TOKEN_SECRET      | YOUR_STRING_HERE | A string that will be used by jwt to generate authentication tokens. The more complex the better, it should be made of random characters ideally. |

**IMPORTANT: .env should be added to .gitignore and never committed to a public repo.**

---
## Getting Started ##

### Installing dependencies ###

After cloning the repo, all the project dependencies can be installed using npm:

```
npm install
```

### Running the server ###

To execute the API code use the following command in terminal:

```
npm run start
```

the API will then be available on port 3000 by default or at the PORT set in the .env file.

### Scripts ###

The following actions can be executed through npm scripts:

#### Transpiling typescript to javascript ####

```
npm run build
```

The transpiled code will be available in the `\build` folder. The transpiling option and configuration can be changed by editing the `tsconfig.json` file.

#### Testing ####

A set of jasmine testing suites and specs can be used to test both the endpoints as well as the models. 

```
npm run test
```

This script runs migrations and tests on the test database by setting the ENV variable to `test` using the `cross-env` package. The script relies on other "child scripts". Those script have been broken up for readability but they should never be run. 

NOTE: if the test script is interrupted by an NPM Error, it will not run to the end, thus potentially leaving data in the test database. To fix that it is recommended to reset the test database by running `npm run reset-test-db` in the terminal before running again any tests. For this command to work db-migrate should be globally installed on your machine as such: `npm i -g db-migrate`

#### Watcher ####

This will kick off the watcher library and start running the application on the port specified in `server.ts` or the `.env`file.

```
npm run watch
```

---
## How to use ##

The API offers several endpoints to access and manipulate data in the database through both CRUD and custom actions. The details of what is required to successfully send requests to each endpoint, data shapes and db schema can be found in the [REQUIREMENTS.md]file.