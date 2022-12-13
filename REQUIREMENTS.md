# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index: ```'products/' [GET] ```
- Show: ```'products/:id' [GET] ```
- Create [token required]: ```'products/' [POST] ```
- delete [token required]: ```'products/' [DELETE] ```
- update [token required]: ```'products/update' [PUT] ```

#### Users
- Index : ```'users/' [GET] ```
- Show : ```'users/:id' [GET] ```
- Create [token required]: ```'users/' [POST] ```
- delete [token required]: ```'users/' [DELETE] ```
- update [token required]: ```'users/update' [PUT] ```
- Authenticate :  ```'users/' [POST] ```

#### Orders
- Current Order by user (args: user id)[token required]: ```'orders/current/:user_id' [GET] ```
- Index: ```'orders/' [GET] ```
- Show: ```'orders/:id' [GET] ```
- Create [token required]: ```'orders/' [POST] ```
- delete [token required]: ```'orders/' [DELETE] ```
- update [token required]: ```'orders/update' [PUT] ```
## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

```
CREATE Table Products (
    id SERIAL PRIMARY KEY, 
    name varchar(50), 
    price float,
    category varchar(50)
    );
```

#### User
- id
- firstName
- lastName
- password

```
CREATE Table Users (
    id SERIAL PRIMARY KEY, 
    firstName varchar(50), 
    lastName varchar(50),
    password varchar
    );
```
#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

```
CREATE Table Orders (
    id SERIAL PRIMARY KEY, 
    product_id integer not null, 
    user_id  integer not null, 
    quantity integer NOT NULL DEFAULT 1, 
    status varchar(50) NOT NULL, 
    FOREIGN KEY (product_id) REFERENCES  Products(id),
    FOREIGN KEY (user_id) REFERENCES  Users(id)
    );
```
