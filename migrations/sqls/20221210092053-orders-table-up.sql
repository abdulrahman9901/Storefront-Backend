/* Replace with your SQL commands */

CREATE Table Orders (
    id SERIAL PRIMARY KEY, 
    product_id integer not null, 
    user_id  integer not null, 
    quantity integer NOT NULL DEFAULT 1, 
    status varchar(50) NOT NULL, 
    FOREIGN KEY (product_id) REFERENCES  Products(id),
    FOREIGN KEY (user_id) REFERENCES  Users(id)
    );