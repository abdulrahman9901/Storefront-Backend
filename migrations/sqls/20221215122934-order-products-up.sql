/* Replace with your SQL commands */

CREATE Table order_products (
    id SERIAL PRIMARY KEY, 
    product_id integer not null, 
    order_id integer not null, 
    quantity integer NOT NULL DEFAULT 1, 
    FOREIGN KEY (product_id) REFERENCES  Products(id),
    FOREIGN KEY (order_id) REFERENCES  Orders(id)
    );